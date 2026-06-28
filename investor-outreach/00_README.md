# BaytyAI — Investor Outreach Package

This folder is the complete outreach system for Laith's capital raise. Two registers
throughout: **US** (direct, metric-led) and **GCC** (relationship-led, vision-aligned).
Never send a US asset to a GCC investor or vice versa.

---

## Information Gaps to Close Before Sending to Investors

These are unresolved in the source files. Do not send anything to an investor until the
critical ones (marked ★) are closed. Everywhere a number is required and absent, the
documents use `[INSERT: …]`.

1. ★ **No verified traction.** No customers, pilots, LOIs, design partners, revenue, or
   ARR appear in any source file. Every traction claim in this package is marked
   `[INSERT: …]`. This is the single biggest gap for a Series A/B conversation.
2. ★ **Pricing is inconsistent across sources.** The live site shows AED 159–1,999/month.
   `SALES_ONEPAGER.md` shows USD $490 / $1,490 / Custom. Pick one canonical price book
   before any investor sees both.
3. ★ **Brand/domain ambiguity.** Files variously say "Bayty", "BaytyAI", `bayty.com`, and
   `baytyai.com`. The live, owned domain is **baytyai.com**. Standardise the name and
   legal entity ("Bayty Technologies") before outreach.
4. ★ **Founder record is not in the files.** Laith's bio, prior roles, domain credibility,
   and any prior exits must be supplied in his own voice (see `01_master_narrative.md`
   origin-story prompt). Do not fabricate.
5. **MVP-vs-roadmap mismatch.** `SALES_ONEPAGER.md` lists 15 modules; the agreed MVP is 6
   (dashboard, document control, approvals, issue tracking, AI summarization, bilingual).
   Be explicit with investors about what is shipped vs. planned.
6. **No financials.** No model, burn, runway, cap table, or use-of-funds detail exists.
   Marked `[INSERT: …]` throughout.
7. **No TAM/SAM/SOM figures** in any file. Slide 8 and the one-pager use `[INSERT: …]`
   with named source guidance.
8. **No verified government, sovereign, or partner relationships.** Per constraints, none
   are claimed. Vision-alignment language is thematic, never an endorsement claim.
9. **Tech stack is partly aspirational.** Supabase/Stripe/Resend are referenced; confirm
   what is actually in production before technical diligence.
10. **Team beyond the founder is undefined.** Slide 13 and the data room use `[INSERT: …]`.

---

## Deliverables, audience, and sequence

| # | File | Purpose | Audience | When to use |
|---|---|---|---|---|
| 00 | `00_README.md` | This index | Internal | First |
| 01 | `01_master_narrative.md` | Canonical story; source of truth for all assets | Internal | Before drafting anything |
| 02 | `02_one_page_executive_summary_US.md` | One-page summary, US register | US VCs / family offices | After a warm reply |
| 02 | `02_one_page_executive_summary_GCC.md` | One-page summary, GCC register | Sovereign / family offices | After an introduction |
| 03 | `03_investor_email_sequences/` | Cold + warm + follow-up templates | All | Outreach phase |
| 04 | `04_investor_one_pager.pdf-ready.md` | Designed one-pager (hand-off) | All (leave-behind) | After first meeting |
| 05 | `05_pitch_deck_outline.md` | 14-slide deck outline + 2 title variants | All (meeting) | First meeting |
| 06 | `06_investor_FAQ.md` | 25 hardest questions + answers | Internal prep | Before every meeting |
| 07 | `07_due_diligence_data_room_checklist.md` | Data-room index by stage | Internal | Pre-meeting onward |
| 08 | `08_meeting_prep_briefs/` | Per-meeting prep template + 2 examples | Internal | Before each meeting |
| 09 | `09_term_sheet_expectations.md` | What to accept/negotiate/refuse | Internal | At term-sheet stage |
| 10 | `10_outreach_target_list_template.md` | CRM-ready target list, Tier A seeded | Internal | Outreach planning |
| 11 | `11_founder_positioning_playbook.md` | 90-day credibility plan | Internal | Day 0 of raise |
| 12 | `12_risk_disclosure_and_red_flags.md` | Pre-mortem — never shown to investors | Internal only | Before outreach |

### Recommended 90-day flow
1. **Week 0:** Close the four ★ gaps. Read `01`, `12`. Publish the founder thesis essay (`11`).
2. **Weeks 1–2:** Build the Tier-A list (`10`), prep briefs (`08`), open the data room (`07`).
3. **Weeks 2–6:** Run email sequences (`03`); lead with warm intros. Use `02` + `04` on reply.
4. **Weeks 4–10:** First meetings with the deck (`05`); prep each with `06` + `08`.
5. **Weeks 8–12:** Term-sheet conversations using `09`.

*Honesty rule for the whole package: investor diligence surfaces every overstatement.
Mark everything uncertain. Flag, do not invent.*
