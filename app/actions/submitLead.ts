'use server';

import { leadSchema, type LeadInput, type LeadResult } from './lead-schema';

const TO_EMAIL =
  process.env.NOTIFICATION_EMAIL_TO || process.env.LEAD_TO_EMAIL || 'info@baytyai.com';
const FROM_EMAIL =
  process.env.NOTIFICATION_EMAIL_FROM || process.env.LEAD_FROM_EMAIL || 'Bayty <info@baytyai.com>';

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission.' };
  }
  const data = parsed.data;

  // Honeypot tripped — pretend success, send nothing.
  if ((data.website ?? '').trim() !== '') {
    return { ok: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const subject = `[Bayty] ${data.inquiryType} request from ${data.fullName} at ${data.organization}`;
  const body = [
    `Inquiry type: ${data.inquiryType}`,
    `Name:         ${data.fullName}`,
    `Work email:   ${data.workEmail}`,
    `Organization: ${data.organization}`,
    `Role:         ${data.role}`,
    `Region:       ${data.region}`,
    '',
    'Message:',
    data.message?.trim() ? data.message.trim() : '(none)',
  ].join('\n');

  if (!apiKey) {
    console.warn('[submitLead] RESEND_API_KEY not set — lead accepted but not emailed:', subject);
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: data.workEmail,
        subject,
        text: body,
      }),
    });
    if (!res.ok) {
      console.error('[submitLead] Resend error:', res.status, await res.text());
      return { ok: false, error: 'We could not send your request. Please try again.' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[submitLead] Unexpected error:', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}
