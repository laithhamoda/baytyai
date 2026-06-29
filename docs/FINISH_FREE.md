# Finishing BaytyAI — professionally, with zero paid services

Everything below is free. The whole stack runs on free tiers; the only thing
that would cost money is collecting card payments online (Stripe) — and there's
a free workaround (manual invoicing).

## 1. Connectors to give Claude (so it finishes the work directly)

Add these at **claude.ai → Settings → Connectors** (or the Claude Code web
environment settings). Once connected, Claude does the dashboard work itself
instead of guiding click-by-click.

| Connector | What Claude can then do | Cost |
|-----------|-------------------------|------|
| **Vercel** | Set env vars, fix domains + SSL, trigger deploys, read build logs | Free |
| **Supabase** | Run SQL, configure Auth (Site URL, email templates, OTP expiry), read auth logs | Free |
| **GitHub** | Code, branches, PRs, merges | Free (already connected) |

> Vercel + Supabase are the high-leverage ones — every remaining blocker is a
> setting in one of those two dashboards.

## 2. Free service stack

| Need | Free service | Notes |
|------|-------------|-------|
| Hosting / CI | **Vercel Hobby** | Project: `bayty`, auto-deploys `main` |
| Database + Auth | **Supabase Free** | Profiles, RLS, email OTP |
| Transactional email | **Resend Free** | 3,000 emails/month; domain `baytyai.com` verified |
| Booking | **Cal.com Free** | Individual plan is free |
| Domain | **Dynadot** | Already owned |
| Analytics (optional) | **Vercel Web Analytics** | Free, toggle in dashboard |

## 3. Remaining punch list

### Blockers (Vercel/Supabase dashboard — fast if Claude is connected)
1. **Apex SSL** — `baytyai.com` certificate invalid. Vercel → `bayty` → Domains →
   ensure apex `baytyai.com` is added and the A record at Dynadot is
   `76.76.21.21`; let the cert re-issue. Workaround meanwhile: use
   `https://bayty.vercel.app`.
2. **Cal.com booking** — create a free event (e.g. "Strategy Consultation",
   90 min), publish it, then set Vercel env var
   `NEXT_PUBLIC_CAL_BOOKING_URL = <username>/<event-slug>` and redeploy.
3. **Admin login** — works via the email OTP code flow. Supabase →
   Authentication → Email Templates → Magic Link must contain `{{ .Token }}`
   (the 6-digit code), and you log in at `/login` with `laithrhamoda@gmail.com`.
   The admin grant SQL is in `supabase/migrations/004_admin_bootstrap.sql`.

### Payment without Stripe (free)
The "$750 fee" is fine to advertise. To collect it without a paid service:
- Cal.com booking stays free (just reserves the time).
- After booking, send a manual invoice / bank-transfer request by email.
- (Optional later: Cal.com + Stripe for automated card payment — Stripe takes a
  per-transaction fee but has no monthly cost.)

### Content polish (code — Claude can do anytime)
- Founder portrait: drop `public/laith-hamoda.jpg` (square, ≥640px).
- Proof section: replace the placeholder excerpts in
  `components/sections/lp-proof.tsx` with real LinkedIn post text.

### Cleanup
- Delete the old Angular Vercel project `baytyai` (the live one is `bayty`).
- Archived Angular code is on branch `archive/angular-dotnet-main`.

## 4. Verify when done

```bash
pnpm verify:deploy https://baytyai.com
```
Checks status, robots, sitemap, OG image, JSON-LD, canonical. All should pass.
