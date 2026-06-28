export const siteConfig = {
  siteUrl: 'https://baytyai.com',
  siteName: 'BaytyAI',
  tagline:
    'AI-Native Operations Infrastructure for GCC Facilities Management & Construction Mega Projects',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
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
