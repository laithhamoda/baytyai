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
      <Preview>[NEW INTAKE] {referenceNumber} — {projectNameEn}</Preview>
      <Tailwind>
        <Body className="bg-[#F4F6F8] font-sans">
          <Container className="mx-auto max-w-[640px] px-4 py-8">
            <Section className="bg-white rounded border border-[#E0E6ED] px-8 py-8 mb-4">
              <Heading className="text-[#0A1628] text-xl font-bold mt-0 mb-1">
                New Project Intake Submitted
              </Heading>
              <Text className="text-[#6B7280] text-sm m-0 mb-6">{formattedDate} (AST)</Text>

              {/* Reference badge */}
              <Section className="bg-[#0A1628] rounded px-4 py-3 mb-6">
                <Text className="text-[#C9A84C] font-mono text-base font-semibold m-0">
                  {referenceNumber}
                </Text>
              </Section>

              {/* Project details */}
              <Heading className="text-[#374151] text-sm uppercase tracking-wider font-semibold mt-0 mb-3">
                Project Details
              </Heading>
              <Section className="border border-[#E5E7EB] rounded mb-6">
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
                    <Column className="w-[40%] px-4 py-2">
                      <Text className="text-xs text-[#6B7280] m-0">{label}</Text>
                    </Column>
                    <Column className="px-4 py-2">
                      <Text className="text-sm text-[#111827] font-medium m-0">{value}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* PoC */}
              <Heading className="text-[#374151] text-sm uppercase tracking-wider font-semibold mt-0 mb-3">
                Point of Contact
              </Heading>
              <Section className="border border-[#E5E7EB] rounded mb-6">
                {[
                  ['Name', pocName],
                  ['Email', pocEmail],
                  ['Phone', pocPhone],
                ].map(([label, value], i) => (
                  <Row key={label} className={i % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                    <Column className="w-[40%] px-4 py-2">
                      <Text className="text-xs text-[#6B7280] m-0">{label}</Text>
                    </Column>
                    <Column className="px-4 py-2">
                      <Text className="text-sm text-[#111827] font-medium m-0">{value}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* Modules */}
              <Heading className="text-[#374151] text-sm uppercase tracking-wider font-semibold mt-0 mb-3">
                Requested Service Modules ({serviceModules.length})
              </Heading>
              <Text className="text-sm text-[#374151] m-0 mb-6 leading-relaxed">
                {serviceModules.map(fmt).join(' · ')}
              </Text>

              <Hr className="border-[#E5E7EB] my-4" />
              <Text className="text-xs text-[#9CA3AF] m-0">
                This is an automated internal notification from the Bayty project intake system. Do not reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
