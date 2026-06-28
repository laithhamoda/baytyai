# BaytyAI Brand System

The canonical brand system for BaytyAI — strategy, language, visual identity, the design
system, the product code, applications, governance, and launch. Built bilingual (English /
Arabic) from the first decision, in the sovereign register expected by GCC government and
sovereign-fund audiences.

This README maps the full intended system and the order to read it. Sections are produced in
dependency order; items not yet produced are marked **[planned]** with the phase that delivers
them.

---

## Read in this order

### 01_strategy/ — *why the brand exists*
- `01_brand_strategy.md` — positioning, audience, category, defensibility, architecture ✅
- `02_competitive_brand_audit.md` — how Procore/Autodesk/Oracle present, and our white space **[planned — Phase 2]**

### 02_verbal_identity/ — *how the brand speaks*
- `01_voice_and_tone.md` — voice principles, register matrix, banned language, bilingual rules ✅
- `02_messaging_architecture.md` — value props, proof points, boilerplate (EN/AR) **[planned — Phase 2]**
- `03_naming_and_lexicon.md` — product/feature naming, the BaytyAI lexicon, Arabic terms **[planned — Phase 2]**

### 03_visual_identity/ — *how the brand looks*
- `01_logo_system.md` — wordmark, lockups, clear space, misuse **[planned — Phase 3]**
- `02_color.md`, `03_typography.md`, `04_layout_and_grid.md`, `05_iconography_and_motion.md` **[planned — Phase 3]**

### 04_design_system/ — *the reusable substance*
- `tokens.css` — the three themes as CSS variables (light / dark / sovereign) ✅
- `tokens.json` — the same tokens as a portable source of truth ✅
- `components.md` — component inventory and states **[planned — Phase 3]**

### 05_code/ — *the product surface*
- A working Next.js 15 project: homepage, platform, government-solutions, contact in full;
  remaining routes stubbed with metadata. **[planned — Phase 4; blocked until build env restored]**

### 06_applications/ — product UI brand, sales collateral, social, environmental, icons **[Phase 5]**
### 07_governance/ — brand book, review checklist, partner kit, evolution policy **[Phase 5]**
### 08_launch/ — launch plan, founder visibility, KPI/brand health **[Phase 6]**

---

## Phasing (and why)

The order is dependency-driven, not arbitrary. Code and collateral both consume the design
tokens; tokens consume the strategy. Building code before the strategy is set produces a
templated result — exactly the anti-pattern the brief forbids.

1. **Phase 1 (now):** Strategy, verbal identity, design tokens. *No environment dependency.*
2. **Phase 2:** Competitive audit, messaging architecture, naming/lexicon.
3. **Phase 3:** Logo system, colour/type/grid/icon/motion specs, component inventory.
4. **Phase 4:** The Next.js 15 build. *Requires the filesystem/build environment restored.*
5. **Phase 5:** Applications + governance.
6. **Phase 6:** Launch.

## Open decisions blocking later phases
- The Next.js 15 build would **replace the live Next.js 14 site**. That is a deliberate
  re-platform decision Laith must authorise (see chat summary).
- Variable-font binaries must be licensed and placed in `05_code/public/fonts/` before the
  code can hit the typography and Lighthouse targets.
- Pricing, brand name (Bayty vs BaytyAI), and traction facts must be reconciled (see
  `/investor-outreach/00_README.md` gaps) — the brand voice references them.
