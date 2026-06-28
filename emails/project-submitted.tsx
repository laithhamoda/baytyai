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
              <Text className="m-0 text-2xl font-bold uppercase tracking-widest text-[#C9A84C]">
                BAYTY
              </Text>
              <Text className="m-0 mt-1 text-xs text-[#6B8099]">
                Sovereign-Grade Construction Intelligence
              </Text>
            </Section>

            {/* Card */}
            <Section className="mb-6 rounded border border-[#1E3A5F] bg-[#0F2040] p-8">
              <Heading className="mb-2 mt-0 text-xl font-semibold text-[#F8F6F1]">
                Project Intake Received
              </Heading>
              <Text className="mb-6 mt-0 text-sm text-[#A0B4C8]">Dear {recipientName},</Text>
              <Text className="text-sm leading-relaxed text-[#D4CEBD]">
                We have successfully received your project intake submission. Our team will review
                the details and reach out within{' '}
                <strong className="text-[#C9A84C]">2 business days</strong>.
              </Text>

              <Hr className="my-6 border-[#1E3A5F]" />

              {/* Reference */}
              <Section className="mb-6 rounded bg-[#0A1628] px-6 py-4">
                <Text className="m-0 mb-1 text-xs uppercase tracking-widest text-[#6B8099]">
                  Reference Number
                </Text>
                <Text className="m-0 font-mono text-lg font-semibold text-[#C9A84C]">
                  {referenceNumber}
                </Text>
                <Text className="m-0 mt-1 text-xs text-[#6B8099]">
                  Quote this number in all communications
                </Text>
              </Section>

              {/* Summary table */}
              <Section>
                <Row className="mb-3">
                  <Column className="w-2/5">
                    <Text className="m-0 text-xs uppercase tracking-wider text-[#6B8099]">
                      Project
                    </Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-sm text-[#F8F6F1]">{projectNameEn}</Text>
                  </Column>
                </Row>
                <Row className="mb-3">
                  <Column className="w-2/5">
                    <Text className="m-0 text-xs uppercase tracking-wider text-[#6B8099]">
                      Organization
                    </Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-sm text-[#F8F6F1]">{organizationName}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-2/5">
                    <Text className="m-0 text-xs uppercase tracking-wider text-[#6B8099]">
                      Submitted
                    </Text>
                  </Column>
                  <Column>
                    <Text className="m-0 text-sm text-[#F8F6F1]">{formattedDate} (AST)</Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="my-6 border-[#1E3A5F]" />

              <Text className="m-0 text-xs leading-relaxed text-[#A0B4C8]">
                If you did not submit this request, please contact us immediately at{' '}
                <span className="text-[#C9A84C]">security@baytyai.com</span>.
              </Text>
            </Section>

            {/* Footer */}
            <Section>
              <Text className="m-0 text-center text-xs text-[#3A5070]">
                Bayty Technologies · Dubai, UAE
              </Text>
              <Text className="m-0 mt-1 text-center text-xs text-[#3A5070]">
                This email was sent to you because a project intake was submitted on your account.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
