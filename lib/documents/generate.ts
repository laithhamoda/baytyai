/**
 * AI document-generation engine (server-only).
 *
 * Mirrors the repo's established AI pattern (see lib/consultant-selection/tor.ts):
 * when ANTHROPIC_API_KEY is present we draft with Claude (claude-opus-4-8) and
 * degrade gracefully to a deterministic template when it is not — so the feature
 * builds and runs before the key is wired, and never hard-fails at runtime.
 *
 * AI is the FIRST DRAFTER, never the authority: output is always a 'draft'
 * record that a human edits and finalises.
 */

const MODEL = 'claude-opus-4-8';

export type DocType = 'rfi' | 'engineers_instruction' | 'material_submittal';

export const DOC_TYPES: DocType[] = ['rfi', 'engineers_instruction', 'material_submittal'];

export interface DocContext {
  project: { name: string; location: string };
  parties: { employer?: string; engineer?: string; contractor?: string };
  packageRef?: string;
  language: 'en' | 'ar';
  /** Free-form typed inputs per doc type (question, description, materialRef, drawingRef…). */
  inputs: Record<string, string>;
}

export interface DocSection {
  heading: string;
  body: string;
}

export interface DocDraft {
  title: string;
  sections: DocSection[];
  fidicClause?: string;
  source: 'ai' | 'template';
}

interface DocSpec {
  label: string;
  originator: string; // party that generates it
  recipient: string; // party that receives it
  fidicClause?: string;
  headings: string[];
  buildPrompt: (ctx: DocContext) => string;
  template: (ctx: DocContext) => DocSection[];
}

export function hasAnthropicKey(): boolean {
  return (
    typeof process.env.ANTHROPIC_API_KEY === 'string' && process.env.ANTHROPIC_API_KEY.length > 0
  );
}

/* ── document registry ──────────────────────────────────────────────────── */

const partyLine = (ctx: DocContext) =>
  `Employer: ${ctx.parties.employer ?? 'unspecified'}; Engineer: ${ctx.parties.engineer ?? 'unspecified'}; Contractor: ${ctx.parties.contractor ?? 'unspecified'}`;

const REGISTRY: Record<DocType, DocSpec> = {
  rfi: {
    label: 'Request for Information (RFI)',
    originator: 'contractor',
    recipient: 'consultant',
    fidicClause: '1.9',
    headings: ['Subject', 'Background', 'Specific Question', 'Proposed Answer', 'Programme Impact'],
    buildPrompt: (ctx) => `You are a senior contracts engineer drafting a Request for Information
(RFI) under a FIDIC 2017 Red Book contract in the UAE/GCC market. Produce a formal, concise,
unambiguous RFI that a Resident Engineer can answer without a site meeting.

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Discipline / package: ${ctx.packageRef ?? 'unspecified'}
Related drawing/specification reference: ${ctx.inputs.drawingRef ?? 'not given'}
Question raised on site:
"""
${ctx.inputs.question ?? 'not specified'}
"""

Return sections in this order: ${['Subject', 'Background', 'Specific Question', 'Proposed Answer', 'Programme Impact'].join(', ')}.
Reference the specific drawing/spec clause; state the programme impact if unanswered; never invent
a drawing number that was not provided. Cite FIDIC Clause 1.9. Write in ${ctx.language === 'ar' ? 'formal GCC construction Arabic (native register, not translated)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Subject',
        body: `RFI regarding ${ctx.inputs.drawingRef ?? 'the referenced works'} — ${ctx.packageRef ?? 'general'}.`,
      },
      {
        heading: 'Background',
        body: `On the works at ${ctx.project.name}, ${ctx.project.location}, clarification is required to proceed.`,
      },
      {
        heading: 'Specific Question',
        body: ctx.inputs.question ?? 'Please confirm the requirement for the referenced item.',
      },
      {
        heading: 'Proposed Answer',
        body: 'The Contractor proposes to proceed on the basis noted above, subject to the Engineer’s confirmation.',
      },
      {
        heading: 'Programme Impact',
        body: 'Any delay in response beyond the agreed period may impact the works programme. Reference: FIDIC 2017 Clause 1.9.',
      },
    ],
  },

  engineers_instruction: {
    label: "Engineer's Instruction (EI)",
    originator: 'consultant',
    recipient: 'contractor',
    fidicClause: '3.5',
    headings: ['Instruction', 'Scope', 'Contractual Basis', 'Action Required'],
    buildPrompt: (ctx) => `You are the Engineer issuing an Engineer's Instruction under FIDIC 2017
Clause 3.5. Draft a clear, enforceable instruction to the Contractor.

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Instruction subject: ${ctx.inputs.description ?? 'not specified'}
Related drawings/specs: ${ctx.inputs.drawingRef ?? 'not given'}

Return sections in this order: Instruction, Scope, Contractual Basis, Action Required.
Cite FIDIC Clause 3.5; do not value any varied work (that is the Contractor's submission).
Write in ${ctx.language === 'ar' ? 'formal GCC construction Arabic (native register)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Instruction',
        body: ctx.inputs.description ?? 'The Contractor is instructed to proceed as set out below.',
      },
      {
        heading: 'Scope',
        body: `Applies to ${ctx.packageRef ?? 'the works'} at ${ctx.project.name}. Refer to ${ctx.inputs.drawingRef ?? 'the contract drawings'}.`,
      },
      {
        heading: 'Contractual Basis',
        body: 'Issued under FIDIC 2017 Clause 3.5 (Engineer’s Instructions).',
      },
      {
        heading: 'Action Required',
        body: 'The Contractor shall comply and confirm receipt. Any consequential variation is to be submitted under Clause 13.3.',
      },
    ],
  },

  material_submittal: {
    label: 'Material Submittal',
    originator: 'contractor',
    recipient: 'consultant',
    fidicClause: '7.2',
    headings: [
      'Submittal Details',
      'Material / Product',
      'Specification Compliance',
      'Attachments',
      'Approval Requested',
    ],
    buildPrompt: (ctx) => `You are a contractor's document controller preparing a Material Submittal
for the Engineer's review under FIDIC 2017 Clause 7.2 (Samples) / project specification.

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Package: ${ctx.packageRef ?? 'unspecified'}
Material / product: ${ctx.inputs.materialRef ?? 'not specified'}
Specification section: ${ctx.inputs.drawingRef ?? 'not given'}

Return sections in this order: Submittal Details, Material / Product, Specification Compliance,
Attachments, Approval Requested. State compliance against the specification; list the expected
attachments (data sheets, test certificates, samples). Write in
${ctx.language === 'ar' ? 'formal GCC construction Arabic (native register)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Submittal Details',
        body: `Material submittal for ${ctx.packageRef ?? 'the works'} at ${ctx.project.name}.`,
      },
      {
        heading: 'Material / Product',
        body: ctx.inputs.materialRef ?? 'As described in the attached technical data.',
      },
      {
        heading: 'Specification Compliance',
        body: `Submitted for compliance with specification section ${ctx.inputs.drawingRef ?? '(ref.)'}.`,
      },
      {
        heading: 'Attachments',
        body: 'Manufacturer data sheets, test certificates, and samples as applicable.',
      },
      {
        heading: 'Approval Requested',
        body: 'The Contractor requests the Engineer’s review and approval under FIDIC 2017 Clause 7.2.',
      },
    ],
  },
};

export function docLabel(t: DocType): string {
  return REGISTRY[t].label;
}

/* ── generation ─────────────────────────────────────────────────────────── */

function extractJson(message: unknown): string {
  // Anthropic SDK message: { content: [{ type:'text', text }] }
  const blocks = (message as { content?: Array<{ type: string; text?: string }> })?.content ?? [];
  const text = blocks
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text as string)
    .join('');
  return text.trim();
}

export async function generateDocument(docType: DocType, ctx: DocContext): Promise<DocDraft> {
  const spec = REGISTRY[docType];
  const title = `${spec.label} — ${ctx.project.name}`;

  if (!hasAnthropicKey()) {
    return {
      title,
      sections: spec.template(ctx),
      fidicClause: spec.fidicClause,
      source: 'template',
    };
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();

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
                  properties: { heading: { type: 'string' }, body: { type: 'string' } },
                },
              },
            },
          },
        },
      },
      messages: [{ role: 'user', content: spec.buildPrompt(ctx) }],
    });

    const parsed = JSON.parse(extractJson(message)) as { sections?: DocSection[] };
    if (!parsed.sections?.length) {
      return {
        title,
        sections: spec.template(ctx),
        fidicClause: spec.fidicClause,
        source: 'template',
      };
    }
    return {
      title,
      sections: parsed.sections.map((s) => ({ heading: s.heading, body: s.body })),
      fidicClause: spec.fidicClause,
      source: 'ai',
    };
  } catch {
    // Any API/parse failure degrades gracefully to the free template.
    return {
      title,
      sections: spec.template(ctx),
      fidicClause: spec.fidicClause,
      source: 'template',
    };
  }
}
