export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

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
    slug: "construction-management-software-uae-2026-guide",
    title: "Construction Management Software in the UAE: The 2026 Buyer's Guide",
    description:
      "How UAE and GCC developers should evaluate construction management software in 2026 — verification, approval workflows, document control, compliance, and pricing.",
    keyword: "construction management software UAE",
    date: "2026-06-05",
    readingMinutes: 9,
    body: [
      { type: "p", text: "The UAE runs some of the most ambitious construction programmes on earth — yet much of the day-to-day coordination still happens across WhatsApp groups, personal email inboxes, and spreadsheets scattered between laptops. As project values rise and regulatory scrutiny tightens, that informality has become the single largest source of delay, dispute, and cost overrun. Choosing the right construction management software is now a board-level decision." },
      { type: "h2", text: "What construction management software actually does" },
      { type: "p", text: "At its core, construction management software centralises the people, documents, approvals, and decisions of a project into one authorised system of record. Instead of reconstructing who approved what from a chain of forwarded emails, every action is named, timestamped, and retrievable. The best platforms model the real construction lifecycle rather than forcing a generic task board onto a complex, regulated process." },
      { type: "h2", text: "The five criteria that matter in the GCC" },
      { type: "ul", items: [
        "Verification: can the platform confirm a contractor's trade licence and a professional's credentials before they touch a live project?",
        "Approval workflows: are sign-offs sequential, named, timestamped, and escalatable — or just a comment thread?",
        "Document control: is there one current version of every drawing and contract, with full version history?",
        "Compliance & data residency: does it meet UAE PDPL expectations, and where is data stored?",
        "Marketplace & payments: can you source verified professionals and protect payments through escrow inside the same system?",
      ]},
      { type: "h2", text: "Why generic tools fall short" },
      { type: "p", text: "Tools built for software teams or general project management treat every task as interchangeable. Construction is not interchangeable. A GCC project moves through a defined lifecycle — brief, team assembly, design, technical specification, consultant scope, subcontractor packages, execution and approvals, inspection, and handover. Software that ignores those stages forces teams back into the informal workarounds it was meant to replace." },
      { type: "h2", text: "How Bayty approaches it" },
      { type: "p", text: "Bayty is built specifically for the UAE and GCC. Every stakeholder is credential-checked before access, approvals run as a named and timestamped chain, documents are version-controlled, and a verified professional marketplace with escrow payments sits inside the same workspace. Pricing starts at AED 159 per month with a 14-day free trial, so teams can evaluate the workflow against a real project before committing." },
      { type: "p", text: "Whichever platform you choose, judge it against the five criteria above — and insist on verification and a true approval audit trail. Those two features are what separate a system of record from another place to lose information." },
    ],
  },
  {
    slug: "verify-contractor-licence-dubai-guide",
    title: "How to Verify a Contractor's Licence in Dubai (2026 Guide)",
    description:
      "A practical 2026 guide to verifying a contractor's trade licence and credentials in Dubai and the UAE before awarding construction work.",
    keyword: "verified contractors Dubai",
    date: "2026-06-05",
    readingMinutes: 7,
    body: [
      { type: "p", text: "Awarding work to an unverified contractor is one of the most expensive mistakes a developer can make. In Dubai, a valid trade licence, the correct activity classification, and current professional credentials are the difference between a defensible project and a dispute waiting to happen. This guide walks through how to verify a contractor properly in 2026." },
      { type: "h2", text: "Step 1 — Confirm the trade licence" },
      { type: "p", text: "Every legitimate contractor operating in Dubai holds a trade licence issued by the relevant economic department or free zone authority. Confirm the licence number, the legal name, and — critically — that the licensed activities actually cover the scope of work you intend to award. A licence for general trading does not authorise structural works." },
      { type: "h2", text: "Step 2 — Check professional credentials" },
      { type: "p", text: "Beyond the company licence, the individuals doing the work should hold relevant professional certifications. For engineering and MEP scopes, verify the qualifications of the named engineers, not just the company. Credentials should be current and matched to the discipline." },
      { type: "h2", text: "Step 3 — Validate identity" },
      { type: "p", text: "Tie the company and its representatives to verifiable identity documents such as the Emirates ID. This prevents the common failure mode where a credentialed entity subcontracts informally to an unverified party who never appears on paper." },
      { type: "h2", text: "Step 4 — Keep the verification on record" },
      { type: "ul", items: [
        "Store the licence, activity classification, and credential checks against the project file.",
        "Record the date of verification and who performed it.",
        "Re-check before each new engagement — licences expire and classifications change.",
      ]},
      { type: "h2", text: "Doing this at scale" },
      { type: "p", text: "Verifying one contractor manually is tedious; verifying every stakeholder on every project is impractical without a system. Bayty runs a government-linked credential check on uploaded documents — Emirates ID, trade licence, and professional certificates — typically within 24 hours, then issues a Bayty Verified badge that other parties on the platform can trust. Verification stops being a one-off chore and becomes a permanent, reusable property of each professional." },
    ],
  },
  {
    slug: "cost-of-approval-delays-gcc-construction",
    title: "The Real Cost of Approval Delays in GCC Construction",
    description:
      "Approval delays are the hidden tax on GCC construction. This data-led analysis breaks down where time is lost and what it costs on a typical project.",
    keyword: "construction project delays GCC",
    date: "2026-06-05",
    readingMinutes: 8,
    body: [
      { type: "p", text: "Ask any GCC project director where the schedule really slips and the answer is rarely the physical work. It is the wait — for a drawing to be approved, a variation to be signed off, a credential to be confirmed. Approval delay is the hidden tax on regional construction, and because it hides inside email threads and messaging apps, it is almost never measured." },
      { type: "h2", text: "Where the time actually goes" },
      { type: "p", text: "On a typical mid-size GCC development, a single approval can pass through five or more roles: owner, lead consultant, discipline engineer, inspector, and general manager. When that chain runs through personal inboxes, each handover introduces latency — a message missed, a stakeholder on leave, an approval given verbally and never recorded. Days become weeks." },
      { type: "h2", text: "Putting a number on it" },
      { type: "p", text: "Consider a AED 10M project. Industry studies place rework at 5–15% of total project value, and a meaningful share of that rework traces back to decisions made on stale or unapproved information. A single prevented week of contractor downtime on a project of that size can save tens of thousands of dirhams — several times the annual cost of the software that would have prevented it." },
      { type: "h2", text: "The signals that predict a delay" },
      { type: "ul", items: [
        "Approvals sitting beyond their SLA window with no escalation.",
        "Multiple revision loops on the same document — a sign of unclear scope.",
        "Decisions made in chat that never reach the project record.",
        "Stakeholders acting on a version that has since been superseded.",
      ]},
      { type: "h2", text: "Closing the gap" },
      { type: "p", text: "The fix is structural, not cultural. When approvals run as a named, timestamped chain with automatic escalation, bottlenecks surface before they breach. When every document has one current version, no one works from a stale drawing. Bayty was built around exactly this: a 9-stage lifecycle, sequential approvals with one-click reminders, and a complete audit trail that turns 'who approved this and when?' from an investigation into a single lookup." },
      { type: "p", text: "Approval delay will never be zero. But measured, surfaced, and escalated, it stops being the silent line item that quietly consumes the schedule." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
