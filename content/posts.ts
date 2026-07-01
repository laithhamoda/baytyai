export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface Post {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  date: string; // ISO
  readingMinutes: number;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: 'construction-management-software-uae-2026-guide',
    title: "Global Construction Management Software: The 2026 Buyer's Guide",
    description:
      'How global developers, contractors, consultants, and public authorities should evaluate construction management software in 2026: verification, approvals, document control, compliance, and enterprise governance.',
    keyword: 'global construction management software',
    date: '2026-06-05',
    readingMinutes: 9,
    body: [
      {
        type: 'p',
        text: 'The world is delivering larger, more complex construction and infrastructure programs than ever before, yet much of the daily coordination still happens across messaging apps, personal email inboxes, and disconnected spreadsheets. As project values rise and regulatory scrutiny tightens, that informality becomes a major source of delay, dispute, and cost overrun. Choosing the right construction management software is now a board-level decision.',
      },
      { type: 'h2', text: 'What construction management software actually does' },
      {
        type: 'p',
        text: 'At its core, construction management software centralizes the people, documents, approvals, and decisions of a project into one authorized system of record. Instead of reconstructing who approved what from a chain of forwarded emails, every action is named, timestamped, and retrievable. The best platforms model the real construction lifecycle rather than forcing a generic task board onto a complex, regulated process.',
      },
      { type: 'h2', text: 'The five criteria that matter globally' },
      {
        type: 'ul',
        items: [
          "Verification: can the platform confirm a contractor's company records, licences, insurance, and professional credentials before they touch a live project?",
          'Approval workflows: are sign-offs sequential, named, timestamped, and escalatable, or just a comment thread?',
          'Document control: is there one current version of every drawing, contract, RFI, submittal, and approval pack, with full version history?',
          'Compliance and data governance: can the platform support regional privacy, procurement, and audit requirements across multiple jurisdictions?',
          'Marketplace and delivery network: can project teams source verified professionals and suppliers inside the same trusted system?',
        ],
      },
      { type: 'h2', text: 'Why generic tools fall short' },
      {
        type: 'p',
        text: 'Tools built for software teams or general project management treat every task as interchangeable. Construction is not interchangeable. A capital project moves through a defined lifecycle: brief, team assembly, design, technical specification, consultant scope, subcontractor packages, execution and approvals, inspection, handover, and operations. Software that ignores those stages forces teams back into the informal workarounds it was meant to replace.',
      },
      { type: 'h2', text: 'How BaytyAI approaches it' },
      {
        type: 'p',
        text: 'BaytyAI is built for global mega-project delivery. Every stakeholder is credential-checked before access, approvals run as named and timestamped chains, documents are version-controlled, and verified marketplace workflows sit inside the same workspace. Enterprise teams can evaluate the workflow against a real project before scaling across a portfolio.',
      },
      {
        type: 'p',
        text: 'Whichever platform you choose, judge it against the five criteria above and insist on verification and a true approval audit trail. Those two features are what separate a system of record from another place to lose information.',
      },
    ],
  },
  {
    slug: 'verify-contractor-licence-dubai-guide',
    title: "How to Verify a Contractor's Credentials Globally (2026 Guide)",
    description:
      "A practical 2026 guide to verifying a contractor's company records, licences, insurance, certifications, and delivery history before awarding construction work.",
    keyword: 'verified contractors global construction',
    date: '2026-06-05',
    readingMinutes: 7,
    body: [
      {
        type: 'p',
        text: 'Awarding work to an unverified contractor is one of the most expensive mistakes a project owner can make. A valid company registration, correct licensed activity, current insurance, relevant certifications, and a credible delivery history are the difference between a defensible project and a dispute waiting to happen. This guide walks through how to verify a contractor properly in 2026.',
      },
      { type: 'h2', text: 'Step 1 - Confirm company records and licences' },
      {
        type: 'p',
        text: 'Every legitimate contractor should have verifiable company registration and operating licences in the jurisdiction where work is performed. Confirm the registration number, legal name, expiry dates, and the licensed activities that cover the scope of work you intend to award. A general commercial registration does not automatically authorize specialist construction work.',
      },
      { type: 'h2', text: 'Step 2 - Check insurance and professional credentials' },
      {
        type: 'p',
        text: 'Beyond the company licence, the individuals doing the work should hold relevant professional certifications. For engineering, MEP, structural, safety, and specialist scopes, verify the qualifications of the named engineers or supervisors, not just the company. Credentials should be current and matched to the discipline.',
      },
      { type: 'h2', text: 'Step 3 - Validate identity and delivery history' },
      {
        type: 'p',
        text: 'Tie the company and its representatives to verifiable identity and project records. This prevents the common failure mode where a credentialed entity subcontracts informally to an unverified party who never appears on paper.',
      },
      { type: 'h2', text: 'Step 4 - Keep the verification on record' },
      {
        type: 'ul',
        items: [
          'Store company registration, licence, insurance, and credential checks against the project file.',
          'Record the date of verification and who performed it.',
          'Re-check before each new engagement because licences, insurance, and certifications expire.',
        ],
      },
      { type: 'h2', text: 'Doing this at scale' },
      {
        type: 'p',
        text: 'Verifying one contractor manually is tedious; verifying every stakeholder on every project is impractical without a system. BaytyAI turns verification into a reusable profile connected to project workflows, approvals, documents, awards, and audit trails.',
      },
    ],
  },
  {
    slug: 'cost-of-approval-delays-gcc-construction',
    title: 'The Real Cost of Approval Delays in Global Construction',
    description:
      'Approval delays are the hidden tax on complex construction and infrastructure projects. This analysis breaks down where time is lost and what it costs.',
    keyword: 'construction approval delays global projects',
    date: '2026-06-05',
    readingMinutes: 8,
    body: [
      {
        type: 'p',
        text: 'Ask any project director where the schedule really slips and the answer is rarely the physical work. It is the wait: for a drawing to be approved, a variation to be signed off, a credential to be confirmed, or a decision to be documented. Approval delay is the hidden tax on construction, and because it hides inside email threads and messaging apps, it is almost never measured.',
      },
      { type: 'h2', text: 'Where the time actually goes' },
      {
        type: 'p',
        text: 'On a typical complex development, a single approval can pass through five or more roles: owner, lead consultant, discipline engineer, inspector, and general manager. When that chain runs through personal inboxes, each handover introduces latency: a message missed, a stakeholder on leave, an approval given verbally and never recorded. Days become weeks.',
      },
      { type: 'h2', text: 'Putting a number on it' },
      {
        type: 'p',
        text: 'Industry studies commonly place rework at a meaningful share of total project value, and many rework events trace back to decisions made on stale or unapproved information. A single prevented week of contractor downtime on a major project can save far more than the annual cost of software that would have prevented it.',
      },
      { type: 'h2', text: 'The signals that predict a delay' },
      {
        type: 'ul',
        items: [
          'Approvals sitting beyond their SLA window with no escalation.',
          'Multiple revision loops on the same document, often signaling unclear scope.',
          'Decisions made in chat that never reach the project record.',
          'Stakeholders acting on a version that has since been superseded.',
        ],
      },
      { type: 'h2', text: 'Closing the gap' },
      {
        type: 'p',
        text: "The fix is structural, not cultural. When approvals run as a named, timestamped chain with automatic escalation, bottlenecks surface before they breach. When every document has one current version, no one works from a stale drawing. BaytyAI is built around exactly this: controlled approvals, verified stakeholders, document governance, and a complete audit trail that turns 'who approved this and when?' from an investigation into a single lookup.",
      },
      {
        type: 'p',
        text: 'Approval delay will never be zero. But measured, surfaced, and escalated, it stops being the silent line item that quietly consumes the schedule.',
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
