import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  contractValue: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed' }, { status: 422 });
  }

  const { name, email, company, contractValue, message } = result.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY not set — submission logged but not emailed');
    console.log('[contact]', { name, email, company, contractValue, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const subject = `Strategy call request — ${company} (${contractValue})`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Contract value: ${contractValue}`,
    message ? `\nMessage:\n${message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? 'BaytyAI <info@baytyai.com>',
      to: [process.env.LEAD_TO_EMAIL ?? 'laithrhamoda@gmail.com'],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('[contact] Resend error:', res.status, detail);
    return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
