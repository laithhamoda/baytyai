import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Bayty",
};

const LAST_UPDATED = "1 June 2025";

const body: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: "14px",
  lineHeight: 1.8,
  color: "rgba(10,22,40,0.8)",
  marginBottom: "16px",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "56px" }}>
      <h2
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: 1.2,
          color: "#0A1628",
          marginBottom: "20px",
          paddingBottom: "12px",
          borderBottom: "0.5px solid rgba(10,22,40,0.12)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#F8F6F1", minHeight: "100vh", padding: "120px 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(10,22,40,0.35)",
            marginBottom: "40px",
            padding: "12px 16px",
            border: "0.5px solid rgba(10,22,40,0.15)",
          }}
        >
          Requires legal review before launch — this is a substantive draft for internal use only.
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "48px",
            lineHeight: 1.08,
            color: "#0A1628",
            marginBottom: "12px",
          }}
        >
          Terms of Service
        </h1>
        <p style={{ ...body, color: "rgba(10,22,40,0.45)", marginBottom: "64px" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Agreement to Terms">
          <p style={body}>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Bayty
            platform operated by Bayty Technologies (&ldquo;Bayty&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;), accessible at baytyai.com. By creating an account or using the
            platform, you agree to be bound by these Terms. If you do not agree, you may not use the
            platform.
          </p>
        </Section>

        <Section title="2. Eligibility and Accounts">
          <p style={body}>
            The platform is intended for verified construction professionals, firms, and developers
            operating in the GCC region. You must provide accurate registration information and
            complete any required verification before your account is activated. You are responsible
            for maintaining the confidentiality of your account credentials and for all activity
            under your account.
          </p>
        </Section>

        <Section title="3. Verification">
          <p style={body}>
            Bayty operates a verification process to confirm the credentials and identity of
            platform users. You agree to submit accurate verification documents and acknowledge that
            Bayty may suspend or terminate accounts where verification cannot be completed or where
            submitted information is found to be false.
          </p>
        </Section>

        <Section title="4. Acceptable Use">
          <p style={body}>
            You agree not to misuse the platform, including by uploading unlawful content,
            misrepresenting your credentials, infringing third-party rights, attempting to gain
            unauthorised access, or interfering with platform security or availability. Bayty
            reserves the right to remove content and suspend accounts that violate these Terms.
          </p>
        </Section>

        <Section title="5. Subscriptions and Payment">
          <p style={body}>
            Paid memberships are billed in advance on a monthly or annual basis through our payment
            processor, Stripe. Fees are non-refundable except where required by applicable law.
            We may change pricing with reasonable notice; changes apply to subsequent billing
            periods.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p style={body}>
            The platform, including its software, design, and content, is owned by Bayty and
            protected by intellectual property laws. You retain ownership of content you upload, and
            grant Bayty a limited licence to host and process that content solely to provide the
            service.
          </p>
        </Section>

        <Section title="7. Disclaimers and Liability">
          <p style={body}>
            The platform is provided &ldquo;as is&rdquo; without warranties of any kind. To the
            maximum extent permitted by law, Bayty shall not be liable for indirect, incidental, or
            consequential damages arising from your use of the platform. Bayty does not guarantee the
            conduct or credentials of any third-party user beyond the scope of its verification
            process.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p style={body}>
            These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be
            subject to the exclusive jurisdiction of the competent courts of the UAE.
          </p>
        </Section>

        <Section title="9. Contact">
          <p style={body}>
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:info@baytyai.com"
              style={{
                color: "#0A1628",
                textDecoration: "underline",
                textDecorationColor: "rgba(201,168,76,0.5)",
                textUnderlineOffset: "3px",
              }}
            >
              info@baytyai.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
