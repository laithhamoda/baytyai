export const siteConfig = {
  siteUrl: 'https://www.baytyai.com',
  siteName: 'BaytyAI',
  tagline:
    'AI construction ERP, facilities management, and compliance infrastructure for global mega projects',
  description:
    'BaytyAI is an enterprise-grade AI construction ERP and facilities management platform for mega construction, infrastructure, real estate, and government-backed programs worldwide. It unifies verified stakeholders, approvals, document control, asset governance, work orders, claims, variations, risk intelligence, predictive maintenance, and compliance in one secure command center.',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
  areaServed: 'Worldwide',
  founder: {
    name: 'Laith Hamoda',
    title: 'Senior AI Prompt Engineer for Mega Projects',
    linkedin: 'https://www.linkedin.com/in/laithhamoda',
    email: 'laithrhamoda@gmail.com',
    location: 'Global',
  },
  calBookingUrl: process.env.NEXT_PUBLIC_CAL_BOOKING_URL,
  contactEmail: 'enterprise@baytyai.com',
} as const;
