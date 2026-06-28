import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — BaytyAIAI',
};

const LAST_UPDATED = '1 June 2025';

const body: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: '14px',
  lineHeight: 1.8,
  color: 'rgba(10,22,40,0.8)',
  marginBottom: '16px',
};

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

export default function CookiePolicyPage() {
  return (
    <div style={{ backgroundColor: '#F8F6F1', minHeight: '100vh', padding: '120px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
          Cookie Policy
        </h1>
        <p style={{ ...body, color: 'rgba(10,22,40,0.45)', marginBottom: '64px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. What Are Cookies">
          <p style={body}>
            Cookies are small text files stored on your device when you visit a website. They allow
            the site to recognise your browser and remember information about your visit. Bayty uses
            cookies and similar technologies to operate, secure, and improve the platform.
          </p>
        </Section>

        <Section title="2. Essential Cookies">
          <p style={body}>
            These cookies are strictly necessary for the platform to function. They include session
            authentication tokens, security tokens, and user preference settings. Essential cookies
            cannot be disabled without materially impairing platform functionality, and they are set
            without requiring consent.
          </p>
        </Section>

        <Section title="3. Analytics Cookies">
          <p style={body}>
            With your consent, we use analytics cookies to collect aggregated information about how
            users interact with the platform. This helps us understand feature usage and improve the
            experience. Analytics cookies are only set after you accept non-essential cookies via
            our consent banner.
          </p>
        </Section>

        <Section title="4. No Advertising Cookies">
          <p style={body}>
            We do not use advertising or retargeting cookies, and we do not share personal data with
            advertising networks for behavioural targeting.
          </p>
        </Section>

        <Section title="5. Managing Your Preferences">
          <p style={body}>
            You can accept or decline non-essential cookies through the consent banner shown on your
            first visit. You may withdraw consent at any time by clearing cookies in your browser or
            adjusting your preferences. Most browsers also allow you to block or delete cookies
            through their settings.
          </p>
        </Section>

        <Section title="6. Contact">
          <p style={body}>
            For questions about our use of cookies, contact us at{' '}
            <a
              href="mailto:info@baytyai.com"
              style={{
                color: '#0A1628',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(201,168,76,0.5)',
                textUnderlineOffset: '3px',
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
