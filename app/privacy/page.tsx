import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Bayty',
};

const LAST_UPDATED = '1 June 2025';

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: '#F8F6F1', minHeight: '100vh', padding: '120px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Legal review notice */}
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(10,22,40,0.35)',
            marginBottom: '40px',
            padding: '12px 16px',
            border: '0.5px solid rgba(10,22,40,0.15)',
          }}
        >
          Requires legal review before launch — this is a substantive draft for internal use only.
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: '48px',
            lineHeight: 1.08,
            color: '#0A1628',
            marginBottom: '12px',
          }}
        >
          Privacy Policy
        </h1>

        <p style={{ ...body, color: 'rgba(10,22,40,0.45)', marginBottom: '64px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        {/* ── 1. Introduction ── */}
        <Section title="1. Introduction">
          <p style={body}>
            Bayty Technologies ("Bayty", "we", "us", or "our") operates the platform accessible at{' '}
            <a href="https://www.baytyai.com" style={link}>
              baytyai.com
            </a>{' '}
            (the "Platform"). We are a technology company incorporated under the laws of the United
            Arab Emirates, providing a verified construction project management and marketplace
            platform for professionals and organisations operating across the GCC region.
          </p>
          <p style={body}>
            This Privacy Policy explains how we collect, use, store, disclose, and protect personal
            information when you access or use the Platform, register for an account, submit
            verification documents, or otherwise interact with our services. It also describes the
            rights available to you under applicable data protection legislation, including the UAE
            Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "UAE PDPL")
            and, where applicable, the EU General Data Protection Regulation (the "GDPR") and UK
            GDPR.
          </p>
          <p style={body}>
            By creating an account or using the Platform, you acknowledge that you have read and
            understood this Privacy Policy. If you do not agree with our practices, you should
            discontinue use of the Platform and contact us to close your account.
          </p>
        </Section>

        {/* ── 2. Information We Collect ── */}
        <Section title="2. Information We Collect">
          <p style={body}>
            We collect information in several categories depending on how you interact with the
            Platform:
          </p>

          <SubHeading>Account and Registration Data</SubHeading>
          <p style={body}>
            When you register, we collect your full name, work email address, mobile number, job
            title, company name, company size, country of operation, and the tier of membership you
            select. This information is required to create and maintain your account and to
            personalise your experience on the Platform.
          </p>

          <SubHeading>Professional Verification Documents</SubHeading>
          <p style={body}>
            To maintain the integrity of the Platform, Bayty requires certain users — including
            engineers, consultants, contractors, and other licensed professionals — to submit
            verification documents. These may include government-issued identity documents,
            professional licences, trade licences, and certificates of registration issued by GCC
            regulatory bodies. These documents are processed solely for identity and credential
            verification purposes and are handled with heightened security measures.
          </p>

          <SubHeading>Project and Transactional Data</SubHeading>
          <p style={body}>
            When you use the Platform to manage projects, you may upload drawings, contracts,
            specifications, approval records, site reports, and other project-related documents. You
            may also create or participate in approval workflows, team directories, and marketplace
            listings. This data is associated with your account and the projects you are authorised
            to access.
          </p>

          <SubHeading>Usage and Technical Data</SubHeading>
          <p style={body}>
            We automatically collect technical information when you use the Platform, including your
            IP address, browser type and version, device type, operating system, referring URLs,
            pages visited, session duration, and feature interactions. This data is used for
            platform security, performance monitoring, and aggregate analytics.
          </p>

          <SubHeading>Cookies and Tracking Technologies</SubHeading>
          <p style={body}>
            We use cookies and similar technologies as described in Section 8 of this Policy.
          </p>
        </Section>

        {/* ── 3. How We Use Your Information ── */}
        <Section title="3. How We Use Your Information">
          <p style={body}>
            We process your personal information on the following legal bases and for the following
            purposes:
          </p>

          <SubHeading>Platform Operation and Service Delivery</SubHeading>
          <p style={body}>
            We use your account data and project data to provide the core functionality of the
            Platform — including project creation and management, document storage and version
            control, approval workflow processing, team directory management, and marketplace
            participation. This processing is necessary for the performance of our contract with
            you.
          </p>

          <SubHeading>Professional Verification</SubHeading>
          <p style={body}>
            We process verification documents to confirm the professional credentials and identities
            of Platform users before granting full account activation. This is a core trust and
            safety feature of the Platform and is carried out in our legitimate interest and the
            legitimate interest of other Platform users who rely on verified counterparties.
          </p>

          <SubHeading>Communications</SubHeading>
          <p style={body}>
            We use your contact information to send transactional communications including account
            activation confirmations, password resets, approval notifications, and platform
            announcements. Where you have provided consent, we may also send product updates and
            relevant industry communications. You may withdraw consent to marketing communications
            at any time by using the unsubscribe mechanism in any such communication.
          </p>

          <SubHeading>Analytics and Platform Improvement</SubHeading>
          <p style={body}>
            We analyse aggregated and pseudonymised usage data to understand how the Platform is
            used, identify areas for improvement, diagnose technical issues, and develop new
            features. This processing is in our legitimate interest to maintain and improve the
            Platform.
          </p>

          <SubHeading>Legal Compliance and Enforcement</SubHeading>
          <p style={body}>
            We may process personal information where necessary to comply with applicable laws and
            regulations in the UAE and other GCC jurisdictions, to respond to lawful requests from
            government authorities, or to establish, exercise, or defend legal claims.
          </p>
        </Section>

        {/* ── 4. Data Storage and Security ── */}
        <Section title="4. Data Storage and Security">
          <p style={body}>
            Platform data, including account information, project documents, and verification
            records, is stored using Supabase infrastructure, which provides enterprise-grade
            encrypted database and storage services. Data at rest is encrypted using AES-256
            encryption. Data in transit is protected using TLS 1.2 or higher. Supabase maintains SOC
            2 Type II certification, providing independent assurance over the security,
            availability, and confidentiality of stored data.
          </p>
          <p style={body}>
            We configure our Supabase deployment to use data centres located within the UAE or
            regional GCC infrastructure where operationally available, in order to support data
            localisation requirements under the UAE PDPL. Where data is processed outside the UAE,
            we rely on appropriate transfer mechanisms including standard contractual clauses or
            adequacy determinations as applicable.
          </p>
          <p style={body}>
            Access to personal data within Bayty is restricted to personnel who require it to
            perform their job functions. All staff with access to personal data are subject to
            confidentiality obligations. We conduct periodic access reviews and maintain audit logs
            of data access events.
          </p>
          <p style={body}>
            In the event of a personal data breach that is likely to result in a risk to your rights
            and freedoms, we will notify the relevant supervisory authority and, where required,
            affected individuals in accordance with applicable legal timeframes.
          </p>
        </Section>

        {/* ── 5. Data Retention ── */}
        <Section title="5. Data Retention">
          <p style={body}>
            We retain your account data, including profile information and project records, for the
            duration of your active account. Following account deletion or termination, we retain
            personal data for a period of 90 days to allow for account reinstatement requests and to
            comply with any contractual obligations owed to other Platform users on joint projects.
            After this period, account data is permanently deleted from our systems.
          </p>
          <p style={body}>
            Professional verification documents — including identity documents and licence
            certificates — are retained for 12 months from the date of submission. This retention
            period supports our ability to respond to regulatory enquiries and dispute resolution
            processes involving verified credentials. After 12 months, verification documents are
            securely deleted unless a longer retention period is required by applicable law.
          </p>
          <p style={body}>
            Transactional data related to Stripe payment processing is retained in accordance with
            UAE commercial and tax record-keeping requirements, which may require retention for up
            to 5 years.
          </p>
          <p style={body}>
            Aggregated and anonymised analytics data, which cannot be used to identify individual
            users, may be retained indefinitely for business intelligence purposes.
          </p>
        </Section>

        {/* ── 6. UAE PDPL Rights ── */}
        <Section title="6. Your Rights Under the UAE PDPL">
          <p style={body}>
            Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "UAE PDPL")
            grants individuals whose data is processed in connection with activities taking place in
            the UAE the following rights:
          </p>

          <SubHeading>Right of Access</SubHeading>
          <p style={body}>
            You have the right to request confirmation of whether we process your personal data and,
            if so, to receive a copy of that data together with information about the purposes of
            processing, the categories of data processed, and the recipients to whom data has been
            disclosed.
          </p>

          <SubHeading>Right to Correction</SubHeading>
          <p style={body}>
            You have the right to request that inaccurate or incomplete personal data we hold about
            you be corrected or completed without undue delay.
          </p>

          <SubHeading>Right to Deletion</SubHeading>
          <p style={body}>
            You have the right to request deletion of your personal data where it is no longer
            necessary for the purposes for which it was collected, where you withdraw consent on
            which processing is based, or where you object to processing and there are no overriding
            legitimate grounds. Deletion requests are subject to our legal retention obligations.
          </p>

          <SubHeading>Right to Data Portability</SubHeading>
          <p style={body}>
            You have the right to receive the personal data you have provided to us in a structured,
            commonly used, and machine-readable format, and to request that we transmit that data to
            another controller where technically feasible.
          </p>

          <p style={body}>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:info@baytyai.com" style={link}>
              info@baytyai.com
            </a>
            . We will respond to verified requests within the timeframes prescribed by the UAE PDPL.
            We may need to verify your identity before processing a rights request.
          </p>
        </Section>

        {/* ── 7. GDPR Rights ── */}
        <Section title="7. Rights for EU and UK Users">
          <p style={body}>
            Where the GDPR or UK GDPR applies to the processing of your personal data — for example,
            if you are located in the European Economic Area or United Kingdom — you have the
            following additional rights:
          </p>
          <p style={body}>
            <strong style={{ fontWeight: 500 }}>Right to Object:</strong> You have the right to
            object to processing of your personal data where we rely on legitimate interests as our
            legal basis. We will cease processing unless we can demonstrate compelling legitimate
            grounds that override your interests.
          </p>
          <p style={body}>
            <strong style={{ fontWeight: 500 }}>Right to Restrict Processing:</strong> You have the
            right to request that we restrict processing of your personal data in certain
            circumstances, including where you contest the accuracy of the data or object to
            processing.
          </p>
          <p style={body}>
            <strong style={{ fontWeight: 500 }}>Right to Withdraw Consent:</strong> Where processing
            is based on your consent, you have the right to withdraw that consent at any time.
            Withdrawal of consent does not affect the lawfulness of processing that took place
            before the withdrawal.
          </p>
          <p style={body}>
            <strong style={{ fontWeight: 500 }}>Right to Lodge a Complaint:</strong> You have the
            right to lodge a complaint with a supervisory authority in the EU member state of your
            habitual residence, place of work, or place of the alleged infringement. UK users may
            lodge a complaint with the Information Commissioner&apos;s Office (ICO).
          </p>
          <p style={body}>
            For transfers of personal data from the EEA or UK to our infrastructure providers, we
            rely on the European Commission&apos;s standard contractual clauses or the UK
            International Data Transfer Agreement as appropriate.
          </p>
        </Section>

        {/* ── 8. Cookies ── */}
        <Section title="8. Cookies">
          <p style={body}>
            We use cookies and similar technologies on the Platform. Cookies are small text files
            stored on your device that allow us to recognise your browser and provide certain
            functionality.
          </p>

          <SubHeading>Essential Cookies</SubHeading>
          <p style={body}>
            These cookies are strictly necessary for the Platform to function. They include session
            authentication tokens, CSRF protection tokens, and user preference settings. Essential
            cookies cannot be disabled without materially impairing Platform functionality.
          </p>

          <SubHeading>Analytics Cookies</SubHeading>
          <p style={body}>
            With your consent, we use analytics cookies to collect aggregated information about how
            users interact with the Platform. This data helps us understand feature usage, identify
            navigation patterns, and improve the overall experience. Analytics cookies are only set
            after you accept non-essential cookies via our consent mechanism.
          </p>

          <SubHeading>Advertising Cookies</SubHeading>
          <p style={body}>
            We do not use advertising or retargeting cookies on the Platform. We do not share
            personal data with advertising networks for behavioural targeting purposes.
          </p>

          <p style={body}>
            You may withdraw consent to non-essential cookies at any time by adjusting your
            preferences through the cookie settings panel accessible in the Platform footer.
          </p>
        </Section>

        {/* ── 9. Third-Party Services ── */}
        <Section title="9. Third-Party Services">
          <p style={body}>
            We work with a small number of trusted third-party service providers who may process
            your personal data on our behalf as data processors. Each provider is subject to a data
            processing agreement that restricts their use of your data to the specific services they
            provide to us.
          </p>

          <SubHeading>Supabase</SubHeading>
          <p style={body}>
            Supabase provides our database, file storage, and authentication infrastructure.
            Personal data including account information, project documents, and verification records
            are stored on Supabase servers. Supabase is SOC 2 Type II certified.{' '}
            <a href="https://supabase.com/privacy" style={link}>
              Supabase Privacy Policy →
            </a>
          </p>

          <SubHeading>Stripe</SubHeading>
          <p style={body}>
            Stripe processes payment transactions on the Platform. When you subscribe to a paid
            membership tier, your payment card data is transmitted directly to Stripe and is not
            stored on Bayty&apos;s servers. Stripe is PCI DSS Level 1 certified.{' '}
            <a href="https://stripe.com/privacy" style={link}>
              Stripe Privacy Policy →
            </a>
          </p>

          <SubHeading>HubSpot</SubHeading>
          <p style={body}>
            HubSpot is used for customer relationship management and marketing communications.
            Contact information for users who have requested access or engaged with our enterprise
            sales process may be stored in HubSpot in accordance with your consent preferences.{' '}
            <a href="https://legal.hubspot.com/privacy-policy" style={link}>
              HubSpot Privacy Policy →
            </a>
          </p>

          <SubHeading>Resend</SubHeading>
          <p style={body}>
            Resend is our transactional email delivery provider. Your email address and the content
            of transactional messages (such as account activation and approval notifications) are
            processed by Resend for the purpose of message delivery.{' '}
            <a href="https://resend.com/legal/privacy-policy" style={link}>
              Resend Privacy Policy →
            </a>
          </p>
        </Section>

        {/* ── 10. Contact ── */}
        <Section title="10. Contact and Data Controller">
          <p style={body}>
            Bayty Technologies is the Data Controller responsible for personal data processed
            through the Platform. If you have any questions about this Privacy Policy, wish to
            exercise your data protection rights, or wish to raise a concern about our data
            practices, please contact our Data Protection team:
          </p>
          <p style={{ ...body, marginTop: '16px' }}>
            <strong style={{ fontWeight: 500 }}>Email:</strong>{' '}
            <a href="mailto:info@baytyai.com" style={link}>
              info@baytyai.com
            </a>
            <br />
            <strong style={{ fontWeight: 500 }}>Platform:</strong>{' '}
            <a href="https://www.baytyai.com" style={link}>
              baytyai.com
            </a>
            <br />
            <strong style={{ fontWeight: 500 }}>Jurisdiction:</strong> United Arab Emirates
          </p>
          <p style={{ ...body, marginTop: '24px' }}>
            We aim to respond to all substantive data protection enquiries within 10 business days.
            Where a formal rights request requires identity verification or internal review, we will
            notify you of any extension to this timeframe and the reasons for it.
          </p>
          <p style={{ ...body, marginTop: '24px' }}>
            We may update this Privacy Policy from time to time to reflect changes in our data
            practices or applicable law. Where changes are material, we will notify registered users
            by email and update the "Last updated" date at the top of this page. Continued use of
            the Platform following notification of material changes constitutes acceptance of the
            revised Policy.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '56px' }}>
      <h2
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.2,
          color: '#0A1628',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '0.5px solid rgba(10,22,40,0.12)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
        fontWeight: 500,
        fontSize: '14px',
        color: '#0A1628',
        letterSpacing: '0.04em',
        marginTop: '24px',
        marginBottom: '8px',
      }}
    >
      {children}
    </h3>
  );
}

/* ── Style constants ── */

const body: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: '14px',
  lineHeight: 1.8,
  color: 'rgba(10,22,40,0.8)',
  marginBottom: '16px',
};

const link: React.CSSProperties = {
  color: '#0A1628',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(201,168,76,0.5)',
  textUnderlineOffset: '3px',
};
