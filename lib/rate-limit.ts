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
