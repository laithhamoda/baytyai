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

interface ProjectSubmittedEmailProps {
  recipientName: string;
  referenceNumber: string;
  projectNameEn: string;
  organizationName: string;
  submittedAt: string;
}

export default function ProjectSubmittedEmail({
  recipientName = 'Valued Client',
  referenceNumber = 'BAYTY-2026-000001',
  projectNameEn = 'Sample Project',
  organizationName = 'Sample Organization',
  submittedAt = new Date().toISOString(),
}: ProjectSubmittedEmailProps) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(submittedAt));

  return (
    <Html>
      <Head />
      <Preview>Your project intake has been received — Ref: {referenceNumber}</Preview>
      <Tailwind>
        <Body className="bg-[#0A1628] font-sans">
          <Container className="mx-auto max-w-[600px] px-4 py-8">
            {/* Logo */}
            <Section className="mb-8">
              <Text className="text-2xl font-bold text-[#C9A84C] tracking-widest uppercase m-0">
                BAYTY
              </Text>
              <Text className="text-xs text-[#6B8099] m-0 mt-1">
                Sovereign-Grade Construction Intelligence
              </Text>
            </Section>

            {/* Card */}
            <Section className="rounded bg-[#0F2040] border border-[#1E3A5F] px-8 py-8 mb-6">
              <Heading className="text-[#F8F6F1] text-xl font-semibold mt-0 mb-2">
                Project Intake Received
              </Heading>
              <Text className="text-[#A0B4C8] text-sm mt-0 mb-6">
                Dear {recipientName},
              </Text>
              <Text className="text-[#D4CEBD] text-sm leading-relaxed">
                We have successfully received your project intake submission. Our team will review the details and reach out within <strong className="text-[#C9A84C]">2 business days</strong>.
              </Text>

              <Hr className="border-[#1E3A5F] my-6" />

              {/* Reference */}
              <Section className="bg-[#0A1628] rounded px-6 py-4 mb-6">
                <Text className="text-xs text-[#6B8099] uppercase tracking-widest m-0 mb-1">
                  Reference Number
                </Text>
                <Text className="text-[#C9A84C] text-lg font-mono font-semibold m-0">
                  {referenceNumber}
                </Text>
                <Text className="text-xs text-[#6B8099] m-0 mt-1">
                  Quote this number in all communications
                </Text>
              </Section>

              {/* Summary table */}
              <Section>
                <Row className="mb-3">
                  <Column className="w-[40%]">
                    <Text className="text-xs text-[#6B8099] uppercase tracking-wider m-0">Project</Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-[#F8F6F1] m-0">{projectNameEn}</Text>
                  </Column>
                </Row>
                <Row className="mb-3">
                  <Column className="w-[40%]">
                    <Text className="text-xs text-[#6B8099] uppercase tracking-wider m-0">Organization</Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-[#F8F6F1] m-0">{organizationName}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40%]">
                    <Text className="text-xs text-[#6B8099] uppercase tracking-wider m-0">Submitted</Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-[#F8F6F1] m-0">{formattedDate} (AST)</Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-[#1E3A5F] my-6" />

              <Text className="text-[#A0B4C8] text-xs leading-relaxed m-0">
                If you did not submit this request, please contact us immediately at{' '}
                <span className="text-[#C9A84C]">security@baytyai.com</span>.
              </Text>
            </Section>

            {/* Footer */}
            <Section>
              <Text className="text-[#3A5070] text-xs text-center m-0">
                Bayty Technologies · Dubai, UAE
              </Text>
              <Text className="text-[#3A5070] text-xs text-center m-0 mt-1">
                This email was sent to you because a project intake was submitted on your account.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
