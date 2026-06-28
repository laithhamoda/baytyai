import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface InternalNotificationEmailProps {
  referenceNumber: string;
  projectNameEn: string;
  organizationName: string;
  organizationCountry: string;
  projectType: string;
  projectPhase: string;
  capexBand: string;
  fundingSource: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  serviceModules: string[];
  submittedAt: string;
}

export default function InternalNotificationEmail({
  referenceNumber = 'BAYTY-2026-000001',
  projectNameEn = 'Sample Project',
  organizationName = 'Sample Organization',
  organizationCountry = 'Saudi Arabia',
  projectType = 'mega_project',
  projectPhase = 'design',
  capexBand = '1b_5b',
  fundingSource = 'sovereign_wealth_fund',
  pocName = 'John Doe',
  pocEmail = 'john@example.com',
  pocPhone = '+966501234567',
  serviceModules = ['project_management', 'document_control'],
  submittedAt = new Date().toISOString(),
}: InternalNotificationEmailProps) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(submittedAt));

  function fmt(snake: string) {
    return snake.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <Html>
      <Head />
      <Preview>
        [NEW INTAKE] {referenceNumber} — {projectNameEn}
      </Preview>
      <Tailwind>
        <Body className="bg-[#F4F6F8] font-sans">
          <Container className="mx-auto max-w-screen-sm px-4 py-8">
            <Section className="mb-4 rounded border border-[#E0E6ED] bg-white p-8">
              <Heading className="mb-1 mt-0 text-xl font-bold text-[#0A1628]">
                New Project Intake Submitted
              </Heading>
              <Text className="m-0 mb-6 text-sm text-[#6B7280]">{formattedDate} (AST)</Text>

              {/* Reference badge */}
              <Section className="mb-6 rounded bg-[#0A1628] px-4 py-3">
                <Text className="m-0 font-mono text-base font-semibold text-[#C9A84C]">
                  {referenceNumber}
                </Text>
              </Section>

              {/* Project details */}
              <Heading className="mb-3 mt-0 text-sm font-semibold uppercase tracking-wider text-[#374151]">
                Project Details
              </Heading>
              <Section className="mb-6 rounded border border-[#E5E7EB]">
                {[
                  ['Project Name', projectNameEn],
                  ['Organization', organizationName],
                  ['Country', organizationCountry],
                  ['Type', fmt(projectType)],
                  ['Phase', fmt(projectPhase)],
                  ['CAPEX Band', fmt(capexBand)],
                  ['Funding', fmt(fundingSource)],
                ].map(([label, value], i) => (
                  <Row key={label} className={i % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                    <Column className="w-2/5 px-4 py-2">
                      <Text className="m-0 text-xs text-[#6B7280]">{label}</Text>
                    </Column>
                    <Column className="px-4 py-2">
                      <Text className="m-0 text-sm font-medium text-[#111827]">{value}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* PoC */}
              <Heading className="mb-3 mt-0 text-sm font-semibold uppercase tracking-wider text-[#374151]">
                Point of Contact
              </Heading>
              <Section className="mb-6 rounded border border-[#E5E7EB]">
                {[
                  ['Name', pocName],
                  ['Email', pocEmail],
                  ['Phone', pocPhone],
                ].map(([label, value], i) => (
                  <Row key={label} className={i % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                    <Column className="w-2/5 px-4 py-2">
                      <Text className="m-0 text-xs text-[#6B7280]">{label}</Text>
                    </Column>
                    <Column className="px-4 py-2">
                      <Text className="m-0 text-sm font-medium text-[#111827]">{value}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* Modules */}
              <Heading className="mb-3 mt-0 text-sm font-semibold uppercase tracking-wider text-[#374151]">
                Requested Service Modules ({serviceModules.length})
              </Heading>
              <Text className="m-0 mb-6 text-sm leading-relaxed text-[#374151]">
                {serviceModules.map(fmt).join(' · ')}
              </Text>

              <Hr className="my-4 border-[#E5E7EB]" />
              <Text className="m-0 text-xs text-[#9CA3AF]">
                This is an automated internal notification from the Bayty project intake system. Do
                not reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
