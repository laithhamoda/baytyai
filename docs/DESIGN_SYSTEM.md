# BaytyAI — "A1" Design System & High-End UI/UX Recommendations

The reference design ("A1") is a **light, premium, trust-forward** system for a
global verified construction & FM marketplace. This document captures the tokens
(now in `tailwind.config.ts`), the logo, and the UI/UX recommendations to bring
the product to a high-end standard.

---

## 1. Brand & logo

- **Mark:** a hexagonal **node graph** — a "home" formed from a connected
  network. Conveys verified, interconnected stakeholders. Component:
  `components/brand/logo.tsx`.
  - `<Logo />` — mark + wordmark (brand blue)
  - `<Logo variant="mark" />` — icon only (favicon/app icon)
  - `<Logo tone="light" />` — white, for dark/photo backgrounds
- **Wordmark:** "Bayty" in Steel-Gray-900 + "AI" in Bayty-Blue-500, set in
  **Playfair Display** (display serif). The serif + geometric mark pairing reads
  as premium and editorial, not generic SaaS.
- **Clear space:** keep padding ≥ the height of the mark's center node on all
  sides. **Min size:** 20px (mark), 96px wide (full lockup).
- **Don't:** stretch, recolor outside the tones provided, add shadows to the
  mark, or place the brand lockup on low-contrast backgrounds.

---

## 2. Color tokens (Tailwind)

| Role | Token | Hex |
|------|-------|-----|
| Primary | `bayty-500` | `#0052cc` |
| Primary hover | `bayty-600` | `#003d99` |
| Primary tint / soft | `bayty-100` / `bayty-50` | `#e0effe` / `#f0f7ff` |
| Accent (CTAs, highlights) | `orange-400` | `#ff6b35` |
| Accent hover | `orange-600` | `#e85a24` |
| Text heading | `steel-900` | `#111827` |
| Text body | `steel-700` | `#374151` |
| Text muted | `steel-500` | `#6b7280` |
| Surface page | `white` | `#ffffff` |
| Surface subtle | `steel-50` | `#fafafa` |
| Border | `steel-200` | `#e5e7eb` |
| Success | `forest-400` | `#2e7d32` |
| Info | `sky-400` | `#0891b2` |
| Danger | `crimson-400` | `#dc2626` |

**Usage discipline:** Blue is the brand/primary; **orange is rare and reserved**
for the single most important action in a view (primary CTA, "new" highlights).
Never use both at equal weight.

---

## 3. Typography

- **Display / headings:** Playfair Display (`font-display`) — h1/h2 hero and
  section titles. Weight 600–700. Use sparingly for impact.
- **Body / UI:** Inter (`font-sans`) — everything else. 400/500/600.
- **Mono:** JetBrains Mono (`font-mono`) — labels, metrics, code.
- **Scale (suggested):** display 48–64px / h2 32–40px / h3 24px / body 16px /
  small 14px / caption 12px. Line-height 1.15 for display, 1.6 for body.
- **Rhythm:** one display font per viewport; don't mix Playfair into body copy.

---

## 4. Shape, elevation, motion

- **Radius:** soft, not sharp — `rounded-card` (16px) for cards/inputs,
  `rounded-pill` for buttons/badges. (The legacy dark theme used 2px; A1 is
  rounded.)
- **Elevation:** `shadow-a1-sm` (resting), `shadow-a1-md` (cards on hover),
  `shadow-a1-lg` (modals/popovers), `shadow-a1-glow` (primary CTA emphasis).
- **Motion:** 150–250ms ease-out for hovers; reveal-on-scroll (fade + 8px rise)
  for sections; respect `prefers-reduced-motion`. Subtle, never showy.

---

## 5. Component standards (high-end)

- **Buttons:** primary = solid `bayty-500` text-white `rounded-pill shadow-a1-sm`,
  hover `bayty-600`; accent CTA = `orange-400`; secondary = white + `steel-200`
  border; ghost = text-only. 44px min height (touch target).
- **Cards:** white, `border-steel-200`, `rounded-card`, `shadow-a1-sm`, lift to
  `shadow-a1-md` on hover; generous 20–24px padding.
- **Inputs:** white, `border-steel-300`, `rounded-card`, `focus-visible` ring
  `0 0 0 3px rgba(0,82,204,0.2)`. Always pair a visible label.
- **Badges/Verified:** verified status uses `forest` with a check; pending uses
  `bayty`; this reinforces the "verified marketplace" promise visually.
- **Data/tables:** zebra `steel-50`, sticky header, right-aligned numerics in
  `font-mono`, tabular-nums.

---

## 6. UX principles

1. **Trust first** — surface verification, role, and audit state everywhere a
   decision is made. The verified badge is a primary UI element, not decoration.
2. **One primary action per screen** — orange CTA marks it; everything else is
   secondary/ghost.
3. **Progressive disclosure** — wizards (onboarding, consultant selection) show
   one decision at a time with a persistent progress rail.
4. **Explainability** — the ranking "why #1" pattern should extend to every
   automated outcome (approvals, gating) — never a black box.
5. **Accessibility (WCAG 2.2 AA)** — 4.5:1 text contrast, visible focus rings,
   keyboard paths, reduced-motion, semantic landmarks. (Bayty-500 on white passes
   AA for ≥16px; use `steel-700`+ for body.)
6. **Responsive & i18n** — mobile-first; RTL-ready (Arabic font already wired).
7. **Performance = perceived quality** — preload the display font, lazy-load
   below-the-fold, keep CLS ~0; a fast site reads as a premium site.

---

## 7. Phased reskin plan (dark → A1 light)

The app currently ships a dark theme; A1 is light. Convert in safe slices so the
site is never half-broken:

1. **Foundation (done):** tokens, Playfair font, logo, this doc.
2. **Primitives:** Button / Card / Input / Badge components on A1 tokens.
3. **Marketing surfaces:** homepage hero → sections → nav/footer (light).
4. **App surfaces:** dashboard shell → marketplace → selection → admin.
5. **Polish:** motion, empty states, illustrations, favicon/OG from the new mark.

Each slice is one PR, typechecked and visually reviewed on a Vercel preview.

---

*Tokens live in `tailwind.config.ts`; the logo in `components/brand/logo.tsx`.*
