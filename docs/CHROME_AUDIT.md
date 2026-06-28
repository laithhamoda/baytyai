# Site Chrome Audit — old product vs new landing

Status as of the Next.js rebuild. Documents how the old "Bayty" marketplace UI
still wraps the new BaytyAI landing page, and the recommended fix.

## The problem

`app/layout.tsx` renders the global chrome on **every** route, unconditionally:

```
<Navigation />            // components/navigation.tsx — old navy (#0A1628)
<main>{children}</main>
<Footer />                // components/footer.tsx — old navy
```

Neither `Navigation` nor `Footer` has any route-based hide logic, so:

1. **New landing (`/`, `/ar`)** renders the old-navy marketing nav on top and the
   old-navy footer at the bottom, around the new dark `ink` sections — a visual
   mismatch. The homepage also renders its own `lp-footer` section, so it shows
   **two footers** (new `lp-footer` + old global `Footer`).
2. **App routes (`/dashboard`, `/account`, `/admin`)** render the old marketing
   nav/footer **and** their own `DashboardShell` chrome — doubled navigation.

## Leftover old-product components (old navy palette)

Still present, used only by old routes or dead:
`components/navigation.tsx`, `components/footer.tsx`, `components/cookie-banner.tsx`,
`components/auth-form.tsx`, and `components/sections/{how-it-works, feature-tiles,
ai-capabilities, pricing-cards, marketplace-join, pricing-roi}.tsx`.

## Recommended fix (route groups)

Split the root layout so chrome is scoped per area:

```
app/
  (marketing)/          # new design-system nav + no global footer
    layout.tsx          #   (pages keep their own lp-footer)
    page.tsx            #   homepage
    ar/page.tsx
    about/, pricing/, faq/, blog/, solutions/, ...
  (app)/                # no marketing chrome — DashboardShell only
    dashboard/, account/, admin/, login/, sign-in/, sign-up/
```

Then:
- Build a new design-system `MarketingNav` (dark `ink`, BaytyAI links + Book CTA)
  to replace the old `Navigation` in the `(marketing)` layout.
- Drop the global `Footer` from the marketing layout (pages own `lp-footer`),
  or promote `lp-footer` to the marketing layout and remove it from `page.tsx`.
- Delete the dead old-product section components once no route imports them.

This is a deliberate refactor touching layout structure and many imports — it
needs a green light on scope before executing, since it moves files and changes
how auth/dashboard routes are wrapped.

## Done already

- `/` and `/ar` content rebuilt to the new design system.
- `lp-footer` AR locale toggle wired to the live `/ar` page.
