import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.enum(['CEO', 'COO', 'Operations Director', 'Commercial Director', 'Other']),
  contractSize: z.enum(['< $5M', '$5–25M', '$25–100M', '> $100M']),
  message: z.string().min(1),
});

// Simple in-memory rate limiter: max 5 requests per IP per hour.
// Falls back to no-op when Map exceeds 10k entries (memory guard).
const ipLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (ipLog.size > 10_000) {
    console.warn('[contact] rate-limit map too large, clearing');
    ipLog.clear();
  }
  const now = Date.now();
  const window = 60 * 60 * 1000;
  const hits = (ipLog.get(ip) ?? []).filter((t) => now - t < window);
  if (hits.length >= 5) return true;
  ipLog.set(ip, [...hits, now]);
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  }

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

  const { name, email, company, role, contractSize, message } = result.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY not set — submission logged but not emailed');
    console.log('[contact]', { name, email, company, role, contractSize, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const subject = `BaytyAI inbound — ${company} — ${role}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Role: ${role}`,
    `Contract size: ${contractSize}`,
    `\nMessage:\n${message}`,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'BaytyAI <info@baytyai.com>',
      to: [process.env.RESEND_TO_EMAIL ?? 'laithrhamoda@gmail.com'],
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
