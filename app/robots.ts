import type { MetadataRoute } from 'next';

const PRIVATE = ['/api/', '/dashboard/', '/account/', '/admin/'];

// Answer-engine / AI crawlers we explicitly welcome (GEO). Allowing these lets
// BaytyAI be cited in ChatGPT, Perplexity, Gemini, Claude, and AI Overviews.
const AI_CRAWLERS = [
  'GPTBot', // OpenAI training
  'OAI-SearchBot', // ChatGPT search
  'ChatGPT-User', // ChatGPT browsing
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended', // Gemini / AI Overviews
  'ClaudeBot',
  'Claude-Web',
  'Anthropic-AI',
  'Applebot-Extended',
  'CCBot', // Common Crawl (feeds many models)
  'cohere-ai',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: everyone may crawl public pages.
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      // AI/answer engines: same public access, explicitly named so there is no
      // ambiguity and we are eligible for AI citations worldwide.
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: '/', disallow: PRIVATE })),
    ],
    sitemap: 'https://baytyai.com/sitemap.xml',
    host: 'https://baytyai.com',
  };
}
