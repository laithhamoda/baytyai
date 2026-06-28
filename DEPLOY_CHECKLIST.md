# BaytyAI — Deploy Checklist

## Vercel Environment Variables

Set in Vercel dashboard → Settings → Environment Variables (Production + Preview):

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only. Never expose client-side.** |
| `RESEND_API_KEY` | Server |
| `RESEND_FROM_EMAIL` | Server (e.g. `BaytyAI <info@baytyai.com>`) |
| `RESEND_TO_EMAIL` | Server (e.g. `laithrhamoda@gmail.com`) |
| `NEXT_PUBLIC_CAL_BOOKING_URL` | Public (e.g. `laithhamoda/strategy`) |
| `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION` | **MUST BE ABSENT in Production** |
| `IMPERSONATION_SECRET` | **MUST BE ABSENT in Production** |

## Domain & DNS (Dynadot)

Add in Dynadot Domain Records:
- `A` → `@` → `76.76.21.21`
- `CNAME` → `www` → `cname.vercel-dns.com`

Then in Vercel → Domains: add `baytyai.com` and `www.baytyai.com`.
SSL provisioned automatically. www → apex redirect is automatic.

## Post-Deploy Verification

```bash
# HTTP status + cache headers
curl -I https://baytyai.com

# robots.txt
curl https://baytyai.com/robots.txt

# sitemap
curl https://baytyai.com/sitemap.xml

# OG image renders
open https://baytyai.com/opengraph-image
```

Validators:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Google Search Console

1. Add domain property for `baytyai.com`
2. Submit sitemap: `https://www.baytyai.com/sitemap.xml`
3. Request indexing for homepage

## Manual TODO Items (Laith)

- [ ] Replace `TODO_PROOF_EXCERPT_01/02/03` in `components/sections/lp-proof.tsx:7-9` with real LinkedIn post excerpts
- [ ] Drop founder portrait at `/public/laith-hamoda.jpg` (square, ≥ 640px) — removes `TODO_FOUNDER_PORTRAIT` in `lp-founder.tsx:21`
- [ ] Confirm `NEXT_PUBLIC_CAL_BOOKING_URL` points to a live, published Cal.com event
- [ ] Confirm Resend domain `baytyai.com` is verified and `info@baytyai.com` is a valid sender
