import { render } from '@react-email/components';
import { Resend } from 'resend';

import InternalNotificationEmail from '@/emails/internal-notification';
import ProjectSubmittedEmail from '@/emails/project-submitted';

const FROM = process.env.DASHBOARD_FROM_EMAIL ?? 'Bayty <info@baytyai.com>';
const OPS_TO = process.env.DASHBOARD_OPS_EMAIL ?? 'ops@baytyai.com';

export interface ProjectEmailPayload {
  recipientName: string;
  recipientEmail: string;
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

export async function sendProjectSubmittedEmails(payload: ProjectEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping project submitted emails');
    return;
  }

  const resend = new Resend(apiKey);
  const now = payload.submittedAt;

  const [clientHtml, internalHtml] = await Promise.all([
    render(
      ProjectSubmittedEmail({
        recipientName: payload.recipientName,
        referenceNumber: payload.referenceNumber,
        projectNameEn: payload.projectNameEn,
        organizationName: payload.organizationName,
        submittedAt: now,
      }),
    ),
    render(
      InternalNotificationEmail({
        referenceNumber: payload.referenceNumber,
        projectNameEn: payload.projectNameEn,
        organizationName: payload.organizationName,
        organizationCountry: payload.organizationCountry,
        projectType: payload.projectType,
        projectPhase: payload.projectPhase,
        capexBand: payload.capexBand,
        fundingSource: payload.fundingSource,
        pocName: payload.pocName,
        pocEmail: payload.pocEmail,
        pocPhone: payload.pocPhone,
        serviceModules: payload.serviceModules,
        submittedAt: now,
      }),
    ),
  ]);

  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: [payload.recipientEmail],
      subject: `Project Intake Received — ${payload.referenceNumber}`,
      html: clientHtml,
    }),
    resend.emails.send({
      from: FROM,
      to: [OPS_TO],
      subject: `[NEW INTAKE] ${payload.referenceNumber} — ${payload.projectNameEn}`,
      html: internalHtml,
    }),
  ]);
}
