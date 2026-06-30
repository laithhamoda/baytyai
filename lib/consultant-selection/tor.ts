/**
 * AI-assisted Terms of Reference (TOR) drafting and proposal summarization for
 * the consultant-selection module.
 *
 * Two-tier design (honors the "no paid services required" constraint):
 *   1. When ANTHROPIC_API_KEY is set, we call Claude (claude-opus-4-8) for a
 *      tailored, well-structured draft / summary.
 *   2. When it is absent, a deterministic template fallback produces a usable,
 *      professional TOR skeleton and a structural proposal summary — no key,
 *      no cost, no external dependency.
 *
 * This module is server-only (it reads ANTHROPIC_API_KEY). Import it from route
 * handlers / server actions, never from a client component.
 */

import type { ProjectComplexity, SelectionMethod } from './types';

export interface TorInput {
  projectTitle: string;
  /** free-text scope / background the user provides at intake */
  scope: string;
  complexity: ProjectComplexity;
  selectionMethod?: SelectionMethod;
  /** optional comma/line separated objectives */
  objectives?: string;
  country?: string;
}

export interface TorSection {
  heading: string;
  body: string;
}

export interface TorDraft {
  title: string;
  sections: TorSection[];
  /** how the draft was produced — surfaced in the UI for transparency */
  source: 'ai' | 'template';
}

export interface ProposalSummaryInput {
  consultantName: string;
  proposalText: string;
}

export interface ProposalSummary {
  consultantName: string;
  strengths: string[];
  concerns: string[];
  summary: string;
  source: 'ai' | 'template';
}

const MODEL = 'claude-opus-4-8';

const METHOD_LABELS: Record<SelectionMethod, string> = {
  QBS: 'Quality-Based Selection',
  QCBS: 'Quality- and Cost-Based Selection',
  LCS: 'Least-Cost Selection',
  FBS: 'Fixed-Budget Selection',
  SSS: 'Single-Source Selection',
};

/** Standard TOR section headings (FIDIC / World-Bank style), used by both tiers. */
const TOR_HEADINGS = [
  'Background',
  'Objectives',
  'Scope of Services',
  'Deliverables',
  'Consultant Qualifications',
  'Reporting & Timeline',
  'Evaluation Criteria',
] as const;

export function hasAnthropicKey(): boolean {
  return (
    typeof process.env.ANTHROPIC_API_KEY === 'string' && process.env.ANTHROPIC_API_KEY.length > 0
  );
}

// ---------------------------------------------------------------------------
// Tier 2 — deterministic template fallback (no API key required)
// ---------------------------------------------------------------------------

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[\n;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function templateTor(input: TorInput): TorDraft {
  const method = input.selectionMethod
    ? METHOD_LABELS[input.selectionMethod]
    : 'a competitive selection process';
  const objectives = splitList(input.objectives);
  const where = input.country ? ` in ${input.country}` : '';

  const sections: TorSection[] = [
    {
      heading: 'Background',
      body: `${input.projectTitle} is a ${input.complexity === 'mega' ? 'large-scale (mega)' : 'commercial'} construction undertaking${where}. ${input.scope.trim()}`,
    },
    {
      heading: 'Objectives',
      body:
        objectives.length > 0
          ? objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')
          : 'Engage a qualified consultant to deliver the services described below to the required standard, on time and within budget.',
    },
    {
      heading: 'Scope of Services',
      body: `The Consultant shall provide professional services covering the full project lifecycle relevant to this engagement, including planning, design review, supervision and reporting as applicable to ${input.projectTitle}.`,
    },
    {
      heading: 'Deliverables',
      body: '- Inception report\n- Periodic progress reports\n- Technical deliverables per the agreed work plan\n- Final close-out report',
    },
    {
      heading: 'Consultant Qualifications',
      body: `Demonstrated experience on comparable ${input.complexity} projects, qualified key personnel, and a sound methodology. Selection will follow ${method}.`,
    },
    {
      heading: 'Reporting & Timeline',
      body: 'The Consultant reports to the Client’s appointed project manager. A detailed timeline with milestones is to be agreed at inception.',
    },
    {
      heading: 'Evaluation Criteria',
      body: 'Proposals are evaluated on weighted technical and financial criteria. Weights are fixed and version-controlled before evaluation begins; the selection rationale is documented and auditable.',
    },
  ];

  return { title: `Terms of Reference — ${input.projectTitle}`, sections, source: 'template' };
}

export function templateProposalSummary(input: ProposalSummaryInput): ProposalSummary {
  const text = input.proposalText.trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0, 3).join(' ') || 'No proposal text was provided to summarize.';
  return {
    consultantName: input.consultantName,
    strengths: [],
    concerns:
      text.length < 200
        ? ['Proposal is brief; request additional detail for a fair evaluation.']
        : [],
    summary,
    source: 'template',
  };
}

// ---------------------------------------------------------------------------
// Tier 1 — Claude-assisted (claude-opus-4-8) via the official SDK
// ---------------------------------------------------------------------------

interface AiTorShape {
  sections: { heading: string; body: string }[];
}

export async function generateTor(input: TorInput): Promise<TorDraft> {
  if (!hasAnthropicKey()) return templateTor(input);

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();

    const method = input.selectionMethod ? METHOD_LABELS[input.selectionMethod] : 'unspecified';
    const prompt = `Draft a professional Terms of Reference (TOR) for a construction consultancy engagement.

Project: ${input.projectTitle}
Complexity: ${input.complexity}
Country: ${input.country ?? 'unspecified'}
Selection method: ${method}
Objectives: ${input.objectives ?? 'not specified'}
Scope / background provided by the client:
"""
${input.scope}
"""

Return a TOR with exactly these sections, in this order: ${TOR_HEADINGS.join(', ')}.
Write clear, internationally-recognized (FIDIC / multilateral-development-bank style) language. Be specific to the project scope above; do not invent budget figures or dates.`;

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['sections'],
            properties: {
              sections: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['heading', 'body'],
                  properties: {
                    heading: { type: 'string' },
                    body: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      messages: [{ role: 'user', content: prompt }],
    });

    const json = extractJson(message);
    const parsed = JSON.parse(json) as AiTorShape;
    if (!parsed.sections?.length) return templateTor(input);
    return {
      title: `Terms of Reference — ${input.projectTitle}`,
      sections: parsed.sections.map((s) => ({ heading: s.heading, body: s.body })),
      source: 'ai',
    };
  } catch {
    // Any API/parse failure degrades gracefully to the free template.
    return templateTor(input);
  }
}

interface AiSummaryShape {
  strengths: string[];
  concerns: string[];
  summary: string;
}

export async function summarizeProposal(input: ProposalSummaryInput): Promise<ProposalSummary> {
  if (!hasAnthropicKey()) return templateProposalSummary(input);

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();

    const prompt = `Summarize the following consultant proposal for an evaluation panel. Be objective and concise. Do not score it.

Consultant: ${input.consultantName}
Proposal:
"""
${input.proposalText}
"""

Return: a 2-3 sentence neutral summary, a list of notable strengths, and a list of concerns or gaps.`;

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['strengths', 'concerns', 'summary'],
            properties: {
              strengths: { type: 'array', items: { type: 'string' } },
              concerns: { type: 'array', items: { type: 'string' } },
              summary: { type: 'string' },
            },
          },
        },
      },
      messages: [{ role: 'user', content: prompt }],
    });

    const json = extractJson(message);
    const parsed = JSON.parse(json) as AiSummaryShape;
    return {
      consultantName: input.consultantName,
      strengths: parsed.strengths ?? [],
      concerns: parsed.concerns ?? [],
      summary: parsed.summary ?? '',
      source: 'ai',
    };
  } catch {
    return templateProposalSummary(input);
  }
}

/** Pull the text payload out of a Messages response (the structured JSON string). */
function extractJson(message: { content: Array<{ type: string; text?: string }> }): string {
  const textBlock = message.content.find((b) => b.type === 'text' && typeof b.text === 'string');
  return textBlock?.text ?? '{}';
}
