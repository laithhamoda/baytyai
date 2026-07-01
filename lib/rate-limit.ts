import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

// 5 project submissions per hour per user
export const projectSubmitRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'bayty:project_submit',
  analytics: false,
});

// 30 draft saves per 10 minutes per user
export const draftSaveRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(30, '10 m'),
  prefix: 'bayty:draft_save',
  analytics: false,
});

// 20 document uploads per hour per user
export const docUploadRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: 'bayty:doc_upload',
  analytics: false,
});

// ---------------------------------------------------------------------------
// Guarded, lazily-constructed limiters for marketplace / verification /
// selection write actions. These FAIL OPEN when Upstash isn't configured, so a
// missing env var can never crash an action — it just skips rate limiting.
// ---------------------------------------------------------------------------

function rateLimitConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

const _limiters = new Map<string, Ratelimit>();

function getLimiter(
  prefix: string,
  tokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
) {
  if (!rateLimitConfigured()) return null;
  if (!_limiters.has(prefix)) {
    _limiters.set(
      prefix,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(tokens, window),
        prefix,
        analytics: false,
      }),
    );
  }
  return _limiters.get(prefix)!;
}

/** Returns true when the action is allowed. Fails open on missing config / errors. */
async function checkLimit(
  prefix: string,
  tokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  key: string,
): Promise<boolean> {
  const rl = getLimiter(prefix, tokens, window);
  if (!rl) return true;
  try {
    const { success } = await rl.limit(key);
    return success;
  } catch {
    return true;
  }
}

/** 20 marketplace writes (inquiries + quotations) per hour per user. */
export const limitMarketplaceWrite = (key: string) => checkLimit('bayty:mkt_write', 20, '1 h', key);

/** 5 verification requests per hour per user. */
export const limitVerificationRequest = (key: string) =>
  checkLimit('bayty:verif_req', 5, '1 h', key);

/** 120 consultant-selection writes per 10 minutes per user (scoring is frequent). */
export const limitSelectionWrite = (key: string) => checkLimit('bayty:sel_write', 120, '10 m', key);
