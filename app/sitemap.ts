import { siteConfig } from '@/lib/siteConfig';

import type { MetadataRoute } from 'next';

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/ai-fm-construction', priority: 0.98, changeFrequency: 'weekly' as const },
  { path: '/mega-projects', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/product', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/solutions', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/security', priority: 0.88, changeFrequency: 'monthly' as const },
  { path: '/compliance', priority: 0.88, changeFrequency: 'monthly' as const },
  { path: '/implementation', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/resources', priority: 0.82, changeFrequency: 'weekly' as const },
  { path: '/pricing', priority: 0.72, changeFrequency: 'monthly' as const },
  { path: '/demo', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.65, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.65, changeFrequency: 'monthly' as const },
  { path: '/ar', priority: 0.9, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
