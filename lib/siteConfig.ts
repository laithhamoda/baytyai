export const siteConfig = {
  siteUrl: 'https://baytyai.com',
  siteName: 'BaytyAI',
  tagline:
    'The global verified marketplace and operations platform for construction and facilities-management projects',
  description:
    'BaytyAI connects verified clients, consultants, contractors, subcontractors, and suppliers worldwide — with structured inquiries, quotations, approvals, and document control on a single trusted platform.',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
  areaServed: 'Worldwide',
  founder: {
    name: 'Laith Hamoda',
    title: 'Senior AI Prompt Engineer for Mega Projects',
    linkedin: 'https://www.linkedin.com/in/laithhamoda',
    email: 'laithrhamoda@gmail.com',
    location: 'Amman, Jordan',
  },
  calBookingUrl: process.env.NEXT_PUBLIC_CAL_BOOKING_URL,
  contactEmail: 'founder@baytyai.com',
} as const;
