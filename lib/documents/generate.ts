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

export type DocType =
  | 'rfi'
  | 'engineers_instruction'
  | 'material_submittal'
  | 'local_purchase_order'
  | 'interim_payment_application'
  | 'variation_order_request';

export const DOC_TYPES: DocType[] = [
  'rfi',
  'engineers_instruction',
  'material_submittal',
  'local_purchase_order',
  'interim_payment_application',
  'variation_order_request',
];

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

  local_purchase_order: {
    label: 'Local Purchase Order (LPO)',
    originator: 'contractor',
    recipient: 'supplier',
    headings: [
      'Order Details',
      'Supplier',
      'Scope of Supply',
      'Commercial Terms',
      'Delivery & Acceptance',
    ],
    buildPrompt: (ctx) => `You are a contractor's procurement officer issuing a Local Purchase Order
(LPO) to a confirmed Supplier in the UAE/GCC market. Draft a clear, enforceable LPO.

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Supplier: ${ctx.inputs.supplierName ?? 'unspecified'}
Materials / equipment: ${ctx.inputs.items ?? 'not specified'}
Commercial value (AED): ${ctx.inputs.totalValue ?? 'not specified'}

Return sections in this order: Order Details, Supplier, Scope of Supply, Commercial Terms,
Delivery & Acceptance. State payment terms, delivery obligations, and that supply is governed by
UAE Commercial Transactions Law. Amounts in AED (peg US$1 = AED 3.6725). Write in
${ctx.language === 'ar' ? 'formal GCC commercial Arabic (native register)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Order Details',
        body: `Local Purchase Order for ${ctx.packageRef ?? 'materials'} on ${ctx.project.name}.`,
      },
      {
        heading: 'Supplier',
        body: ctx.inputs.supplierName ?? 'As named in the accompanying award.',
      },
      {
        heading: 'Scope of Supply',
        body: ctx.inputs.items ?? 'Materials/equipment as scheduled in the attached list.',
      },
      {
        heading: 'Commercial Terms',
        body: `Total order value AED ${ctx.inputs.totalValue ?? '(to be confirmed)'}. Payment terms as agreed. Governed by UAE Commercial Transactions Law.`,
      },
      {
        heading: 'Delivery & Acceptance',
        body: 'Delivery to site against a signed delivery note; acceptance subject to inspection and conformance to specification.',
      },
    ],
  },

  interim_payment_application: {
    label: 'Interim Payment Application (IPA)',
    originator: 'contractor',
    recipient: 'consultant',
    fidicClause: '14.3',
    headings: [
      'Application Details',
      'Valuation Summary',
      'Retention',
      'Net Amount Claimed',
      'Supporting Statement',
    ],
    buildPrompt: (ctx) => `You are a contractor's quantity surveyor preparing an Interim Payment
Application under FIDIC 2017 Clause 14.3. Draft a clear, substantiated application.

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Period ending: ${ctx.inputs.periodEnd ?? 'unspecified'}
Gross value of work done (AED): ${ctx.inputs.grossAmount ?? 'not specified'}
Previously certified (AED): ${ctx.inputs.previousAmount ?? '0'}

Return sections in this order: Application Details, Valuation Summary, Retention, Net Amount Claimed,
Supporting Statement. Apply retention and deduct previous certificates to compute the net claimed.
Cite FIDIC Clause 14.3. Amounts in AED (peg US$1 = AED 3.6725). Write in
${ctx.language === 'ar' ? 'formal GCC construction Arabic (native register)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Application Details',
        body: `Interim Payment Application for the period ending ${ctx.inputs.periodEnd ?? '(period)'} on ${ctx.project.name}.`,
      },
      {
        heading: 'Valuation Summary',
        body: `Gross value of work executed to date: AED ${ctx.inputs.grossAmount ?? '(amount)'}.`,
      },
      {
        heading: 'Retention',
        body: 'Retention applied per the Contract (typically 5–10% of the gross value).',
      },
      {
        heading: 'Net Amount Claimed',
        body: `Net claimed = gross less retention less previously certified (AED ${ctx.inputs.previousAmount ?? '0'}).`,
      },
      {
        heading: 'Supporting Statement',
        body: 'Submitted under FIDIC 2017 Clause 14.3 with supporting measurement and documentation.',
      },
    ],
  },

  variation_order_request: {
    label: 'Variation Order Request (VOR)',
    originator: 'contractor',
    recipient: 'consultant',
    fidicClause: '13.3',
    headings: [
      'Variation Description',
      'Contractual Basis',
      'Cost Impact',
      'Time Impact',
      'Request',
    ],
    buildPrompt: (ctx) => `You are a contractor's contracts manager submitting a Variation Order
Request to the Engineer under FIDIC 2017 Clause 13.3 (Variation Procedure).

Project: ${ctx.project.name}, ${ctx.project.location}
${partyLine(ctx)}
Variation description: ${ctx.inputs.description ?? 'not specified'}
Estimated cost impact (AED): ${ctx.inputs.valuation ?? 'not specified'}
Estimated time impact (days): ${ctx.inputs.timeImpact ?? '0'}

Return sections in this order: Variation Description, Contractual Basis, Cost Impact, Time Impact,
Request. Cite FIDIC Clause 13.3. Amounts in AED (peg US$1 = AED 3.6725). Write in
${ctx.language === 'ar' ? 'formal GCC construction Arabic (native register)' : 'clear formal English'}.`,
    template: (ctx) => [
      {
        heading: 'Variation Description',
        body: ctx.inputs.description ?? 'The Contractor requests a variation as described.',
      },
      {
        heading: 'Contractual Basis',
        body: 'Submitted under FIDIC 2017 Clause 13.3 (Variation Procedure).',
      },
      {
        heading: 'Cost Impact',
        body: `Estimated cost impact: AED ${ctx.inputs.valuation ?? '(to be agreed)'}.`,
      },
      {
        heading: 'Time Impact',
        body: `Estimated time impact: ${ctx.inputs.timeImpact ?? '0'} day(s), with any Extension of Time reserved under Clause 8.5.`,
      },
      {
        heading: 'Request',
        body: 'The Contractor requests the Engineer’s determination and instruction under Clause 13.',
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
