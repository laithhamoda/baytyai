/**
 * Exportable award-recommendation report.
 *
 * Renders a self-contained, print-styled HTML document from a ranking snapshot
 * and explanation. The browser's "Save as PDF" turns it into a polished PDF —
 * no PDF library, no headless browser, no paid service required.
 *
 * Pure (no I/O); safe to import anywhere. The route handler returns the string
 * as text/html so the user can print it to PDF.
 */

import type { RankedConsultant, RankingExplanation } from './types';

export interface AwardReportInput {
  projectTitle: string;
  organizationName?: string;
  selectionMethod?: string;
  /** ISO date string; the report stamps this — keeps the function pure. */
  generatedAt: string;
  ranked: RankedConsultant[];
  explanation: RankingExplanation | null;
  /** optional free-text rationale from the panel */
  rationale?: string;
}

/** Minimal HTML escaping for interpolated user content. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderAwardReportHtml(input: AwardReportInput): string {
  const winner = input.ranked[0];
  const date = esc(input.generatedAt.slice(0, 10));
  const org = input.organizationName ? esc(input.organizationName) : 'BaytyAI';
  const method = input.selectionMethod ? esc(input.selectionMethod) : '—';

  const criteriaHeaders = winner
    ? winner.perCriterion.map((c) => `<th>${esc(c.label)} (${c.weight}%)</th>`).join('')
    : '';

  const rows = input.ranked
    .map((r) => {
      const cells = r.perCriterion
        .map((c) => `<td class="num">${(c.normalized * 100).toFixed(0)}%</td>`)
        .join('');
      const top = r.rank === 1 ? ' class="winner"' : '';
      return `<tr${top}>
        <td class="rank">#${r.rank}</td>
        <td>${esc(r.name)}</td>
        ${cells}
        <td class="num tech">${r.technicalTotal.toFixed(1)}</td>
        <td class="num fin">${r.financialTotal.toFixed(1)}</td>
        <td class="num total">${r.weightedTotal.toFixed(1)}</td>
      </tr>`;
    })
    .join('');

  const reasons =
    input.explanation && input.explanation.reasons.length > 0
      ? `<ul>${input.explanation.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
      : '<p>Only one consultant was evaluated, or scores are tied; see the comparison table above.</p>';

  const margin = input.explanation
    ? `<p class="margin">Lead margin: <strong>${input.explanation.marginPoints}</strong> weighted points over the runner-up.</p>`
    : '';

  const rationale = input.rationale
    ? `<section><h2>Panel rationale</h2><p>${esc(input.rationale).replace(/\n/g, '<br>')}</p></section>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Award Recommendation — ${esc(input.projectTitle)}</title>
<style>
  :root { --ink:#1a1a1a; --muted:#666; --line:#ddd; --accent:#0b5; --bg:#fafafa; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: var(--ink); margin: 0; padding: 40px; background: #fff; }
  header { border-bottom: 2px solid var(--ink); padding-bottom: 16px; margin-bottom: 24px; }
  .eyebrow { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
  h1 { font-size: 24px; margin: 0; }
  .meta { font-size: 12px; color: var(--muted); margin-top: 8px; }
  .meta span { margin-right: 18px; }
  .recommend { background: var(--bg); border-left: 4px solid var(--accent); padding: 16px 20px; margin: 24px 0; }
  .recommend .label { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin: 0 0 4px; }
  .recommend .name { font-size: 20px; font-weight: 600; margin: 0; }
  .recommend .score { font-size: 13px; color: var(--muted); margin: 4px 0 0; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .1em; border-bottom: 1px solid var(--line); padding-bottom: 6px; margin: 28px 0 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid var(--line); padding: 7px 9px; text-align: left; }
  th { background: var(--bg); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.rank { font-weight: 600; }
  td.total { font-weight: 700; }
  td.tech { color: #246; }
  td.fin { color: #642; }
  tr.winner { background: #f0fbf5; }
  ul { margin: 8px 0; padding-left: 20px; }
  li { margin: 4px 0; font-size: 13px; }
  .margin { font-size: 13px; }
  footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 11px; color: var(--muted); }
  .print-hint { background: #fff8e1; border: 1px solid #f0d000; padding: 10px 14px; font-size: 12px; margin-bottom: 20px; border-radius: 4px; }
  @media print { .print-hint { display: none; } body { padding: 0; } }
</style>
</head>
<body>
  <div class="print-hint">Use your browser's Print → “Save as PDF” to export this award recommendation.</div>
  <header>
    <p class="eyebrow">Award Recommendation Report</p>
    <h1>${esc(input.projectTitle)}</h1>
    <div class="meta">
      <span>Organization: ${org}</span>
      <span>Selection method: ${method}</span>
      <span>Generated: ${date}</span>
    </div>
  </header>

  ${
    winner
      ? `<div class="recommend">
    <p class="label">Recommended for award</p>
    <p class="name">${esc(winner.name)}</p>
    <p class="score">Weighted score ${winner.weightedTotal.toFixed(1)} / 100 — technical ${winner.technicalTotal.toFixed(1)}, financial ${winner.financialTotal.toFixed(1)}.</p>
  </div>`
      : '<p>No consultants were evaluated.</p>'
  }

  <section>
    <h2>Comparison &amp; ranking</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th><th>Consultant</th>${criteriaHeaders}
          <th>Technical</th><th>Financial</th><th>Weighted</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:11px;color:var(--muted);margin-top:6px;">Per-criterion cells show the normalized score (0–100%). Technical, Financial and Weighted columns are weighted points contributing to the 0–100 total.</p>
  </section>

  <section>
    <h2>Why ${winner ? esc(winner.name) : 'the leader'} ranks first</h2>
    ${margin}
    ${reasons}
  </section>

  ${rationale}

  <footer>
    Generated by BaytyAI Consultant Selection. Criteria and weights were version-controlled and locked before scoring; this report reflects the locked criteria set and submitted evaluations. This is a recommendation for the awarding authority's decision.
  </footer>
</body>
</html>`;
}
