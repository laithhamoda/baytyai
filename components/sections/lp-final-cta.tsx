'use client';

import CalEmbed from '@/components/booking/CalEmbed';
import ContactForm from '@/components/booking/ContactForm';
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

export default function FinalCta() {
  return (
    <section id="book" aria-labelledby="book-heading" className="bg-ink-950 py-24">
      <Container>
        <SectionHeading
          eyebrow="BOOK"
          h2="Bring one live contract to a 90-minute Strategy Consultation."
          sub="We will map it against the three failure modes and identify the single highest-leverage AI intervention before the call ends. The $750 fee is credited toward any Diagnostic Engagement booked within 30 days."
          align="center"
          className="mb-16"
        />

        <div className="flex flex-col gap-16">
          {/* Cal.com embed */}
          <CalEmbed className="min-h-[600px]" />

          {/* Divider */}
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-ink-700" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
              or send a message
            </span>
            <div className="h-px flex-1 bg-ink-700" />
          </div>

          {/* Contact form fallback */}
          <div className="mx-auto w-full max-w-lg">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
