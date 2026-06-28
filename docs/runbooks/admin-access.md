# Admin access runbook

How to get and use professional admin access on BaytyAI.

## How admin works

- Authentication is **Supabase email one-time-code (OTP)** at **`/login`**.
- Authorization is the `profiles.role` column. `role = 'admin'` unlocks `/admin`
  (site content editor) and the admin-only dashboard areas (`/dashboard/settings`,
  member management).
- Admin is **never** assignable from the browser. RLS lets a user update only
  their own profile row, and no client path writes `role = 'admin'`.

## Who is admin

Granted automatically to the allowlist in migration
`supabase/migrations/004_admin_bootstrap.sql`:

```
info@baytyai.com
laithrhamoda@gmail.com
```

The allowlist is enforced server-side in two places:
1. `handle_new_user()` — a matching email becomes `admin` the moment it signs up.
2. A one-time backfill — promotes a matching account that already existed.

To add/remove an admin later: edit `public.admin_email_allowlist()` and ship a
new migration.

## One-time setup (operator)

1. Apply the migration to your Supabase project:
   - Supabase Dashboard → SQL Editor → paste `004_admin_bootstrap.sql` → Run, **or**
   - `supabase db push` if you use the CLI.
2. Confirm SMTP is configured (Supabase → Auth → SMTP → Resend) so the OTP email
   sends. (Already done per the earlier email/DNS work.)

## How you log in

1. Go to **`https://www.baytyai.com/login`**.
2. Enter `info@baytyai.com` (or `laithrhamoda@gmail.com`).
3. Check email for the 6-digit code, enter it.
4. You're signed in. Visit **`/admin`** to edit site content.

If you signed up **before** the migration was applied, the backfill promotes you
on first run — no need to re-register. If you sign up after, you're admin
immediately.

## Verify it worked (SQL)

```sql
select u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id
where lower(u.email) = any (public.admin_email_allowlist());
-- expect role = 'admin' for each
```

## Notes

- `/sign-in` and `/sign-up` now redirect to `/login`. They previously used a
  separate, parallel NextAuth LinkedIn flow that did **not** create a Supabase
  session and therefore could never reach admin. `/login` is the single
  canonical auth path.
