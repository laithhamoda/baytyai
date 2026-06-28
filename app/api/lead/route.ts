import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface LeadPayload {
  formType?: string;
  [key: string]: unknown;
}

const TO_EMAIL = process.env.LEAD_TO_EMAIL || 'info@baytyai.com';
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || 'Bayty <noreply@baytyai.com>';

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let data: LeadPayload;
  try {
    data = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Minimal server-side validation
  const email = data.workEmail ?? data.email;
  const name = data.fullName ?? data.name;
  if (!name || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid name and work email are required.' },
      { status: 422 },
    );
  }

  const formType = String(data.formType || 'request-access');
  const subject = `New ${formType} submission — ${String(name)}`;
  const lines = Object.entries(data)
    .filter(([k]) => k !== 'formType')
    .map(([k, v]) => `${k}: ${v ?? '—'}`)
    .join('\n');

  const apiKey = process.env.RESEND_API_KEY;

  // If email isn't configured yet, accept the lead gracefully so the UX works,
  // but signal that delivery is pending configuration (visible in logs).
  if (!apiKey) {
    console.warn('[lead] RESEND_API_KEY not set — lead accepted but not emailed:', subject);
    return NextResponse.json({ ok: true, delivered: false });
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
        reply_to: String(email),
        subject,
        text: `${subject}\n\n${lines}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('[lead] Resend error:', res.status, detail);
      return NextResponse.json({ ok: false, error: 'Delivery failed.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[lead] Unexpected error:', err);
    return NextResponse.json({ ok: false, error: 'Unexpected server error.' }, { status: 500 });
  }
}
