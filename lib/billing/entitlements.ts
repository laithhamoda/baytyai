export const TIER_LIMITS = {
  free:       { seats: 2,          aiTokens: 50_000,      projects: 1          },
  pro:        { seats: 10,         aiTokens: 1_000_000,   projects: 10         },
  business:   { seats: 50,         aiTokens: 10_000_000,  projects: Infinity   },
  enterprise: { seats: Infinity,   aiTokens: Infinity,    projects: Infinity   },
} as const;

export type Tier = keyof typeof TIER_LIMITS;
export type Metric = keyof typeof TIER_LIMITS['free'];

export function withinLimit(tier: Tier, metric: Metric, used: number): boolean {
  return used < TIER_LIMITS[tier][metric];
}

export function getLimit(tier: Tier, metric: Metric): number {
  return TIER_LIMITS[tier][metric];
}
