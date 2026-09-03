import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null;
  memoryCache: Map<string, { value: any; expiresAt: number }>;
  inFlightFetches: Map<string, Promise<any>>;
};

if (!globalForRedis.memoryCache) {
  globalForRedis.memoryCache = new Map();
}

if (!globalForRedis.inFlightFetches) {
  globalForRedis.inFlightFetches = new Map();
}

const memoryCache = globalForRedis.memoryCache;
const inFlightFetches = globalForRedis.inFlightFetches;

function getRedisInstance(): Redis | null {
  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  if (!globalForRedis.redisClient) {
    try {
      const client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1500,
        enableOfflineQueue: false,
        retryStrategy(times) {
          if (times > 3) return null; // Stop retrying if Redis is down
          return Math.min(times * 100, 1000);
        },
      });

      client.on('error', (err) => {
        console.warn('[Redis Client Warning]:', err.message);
      });

      globalForRedis.redisClient = client;
    } catch (e) {
      console.warn('[Redis Instantiation Warning]:', e);
      globalForRedis.redisClient = null;
    }
  }

  return globalForRedis.redisClient;
}

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedisInstance();

  if (redis && redis.status === 'ready') {
    try {
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (err) {
      console.warn(`[Cache GET Warning] Redis read failed for key ${key}:`, err);
    }
  }

  // Fallback to in-memory cache
  const cached = memoryCache.get(key);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.value as T;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * Set item into Redis or In-Memory fallback.
 */
export async function setCache<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
  const redis = getRedisInstance();
  const serialized = JSON.stringify(data);

  if (redis && redis.status === 'ready') {
    try {
      await redis.setex(key, ttlSeconds, serialized);
    } catch (err) {
      console.warn(`[Cache SET Warning] Redis set failed for key ${key}:`, err);
    }
  }

  // Set in memory cache as well
  memoryCache.set(key, {
    value: data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  // LRU cleanup if memory cache grows > 1000 items
  if (memoryCache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of Array.from(memoryCache.entries())) {
      if (v.expiresAt < now) {
        memoryCache.delete(k);
      }
    }
  }
}

/**
 * Delete key or pattern from Redis and in-memory cache.
 */
export async function invalidateCache(keyOrPattern: string): Promise<void> {
  const redis = getRedisInstance();

  // Delete from in-memory cache
  if (keyOrPattern.includes('*')) {
    const regex = new RegExp('^' + keyOrPattern.replace(/\*/g, '.*') + '$');
    for (const k of Array.from(memoryCache.keys())) {
      if (regex.test(k)) {
        memoryCache.delete(k);
      }
    }
  } else {
    memoryCache.delete(keyOrPattern);
  }

  // Delete from Redis
  if (redis && redis.status === 'ready') {
    try {
      if (keyOrPattern.includes('*')) {
        const keys = await redis.keys(keyOrPattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } else {
        await redis.del(keyOrPattern);
      }
    } catch (err) {
      console.warn(`[Cache DEL Warning] Redis delete failed for ${keyOrPattern}:`, err);
    }
  }
}

/**
 * Fetch data with cache stampede protection.
 * If multiple requests ask for the same missing cache key simultaneously,
 * only ONE fetchFn execution runs and resolves for all concurrent callers.
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // 1. Try reading from cache
  const cachedData = await getCache<T>(key);
  if (cachedData !== null) {
    return cachedData;
  }

  // 2. Prevent cache stampede: check if fetch is already in flight
  let inFlight = inFlightFetches.get(key);

  if (!inFlight) {
    inFlight = (async () => {
      try {
        const data = await fetchFn();
        if (data !== undefined && data !== null) {
          await setCache(key, data, ttlSeconds);
        }
        return data;
      } finally {
        inFlightFetches.delete(key);
      }
    })();

    inFlightFetches.set(key, inFlight);
  }

  return inFlight;
}

// Key Constants
export const CACHE_KEYS = {
  HEADER_CATEGORIES: 'tapa:cache:header_categories',
  FOOTER_CONFIG: 'tapa:cache:footer_config',
  HOMEPAGE_SECTIONS: 'tapa:cache:homepage_sections',
  HOMEPAGE_PART3: 'tapa:cache:homepage_part3',

  PUBLIC_PRODUCTS_ALL: 'tapa:cache:products:all',
  PUBLIC_PRODUCT_SLUG: (slug: string) => `tapa:cache:product:slug:${slug}`,

  PUBLIC_RITUAL_GUIDES_ALL: 'tapa:cache:ritual_guides:all',
  PUBLIC_RITUAL_GUIDE_SLUG: (slug: string) => `tapa:cache:ritual_guide:slug:${slug}`,

  PUBLIC_BEGINNER_GUIDES_ALL: 'tapa:cache:beginner_guides:all',
  PUBLIC_BEGINNER_GUIDE_SLUG: (slug: string) => `tapa:cache:beginner_guide:slug:${slug}`,

  PUBLIC_DHARMIC_CONCEPTS_ALL: 'tapa:cache:dharmic_concepts:all',
  PUBLIC_DHARMIC_CONCEPT_SLUG: (slug: string) => `tapa:cache:dharmic_concept:slug:${slug}`,

  PUBLIC_CALENDAR_SHELF: 'tapa:cache:calendar_shelf',
  PANCHANG_TODAY: 'tapa:cache:panchang:today',
  PANCHANG_VRAT_CALENDAR: (year: number) => `tapa:cache:panchang:vrat:${year}`,
};

// Invalidation Helper Functions
export async function invalidateProductCache(slug?: string) {
  await invalidateCache(CACHE_KEYS.PUBLIC_PRODUCTS_ALL);
  if (slug) {
    await invalidateCache(CACHE_KEYS.PUBLIC_PRODUCT_SLUG(slug));
  }
}

export async function invalidateRitualGuideCache(slug?: string) {
  await invalidateCache(CACHE_KEYS.PUBLIC_RITUAL_GUIDES_ALL);
  if (slug) {
    await invalidateCache(CACHE_KEYS.PUBLIC_RITUAL_GUIDE_SLUG(slug));
  }
}

export async function invalidateBeginnerGuideCache(slug?: string) {
  await invalidateCache(CACHE_KEYS.PUBLIC_BEGINNER_GUIDES_ALL);
  if (slug) {
    await invalidateCache(CACHE_KEYS.PUBLIC_BEGINNER_GUIDE_SLUG(slug));
  }
}

export async function invalidateDharmicConceptCache(slug?: string) {
  await invalidateCache(CACHE_KEYS.PUBLIC_DHARMIC_CONCEPTS_ALL);
  if (slug) {
    await invalidateCache(CACHE_KEYS.PUBLIC_DHARMIC_CONCEPT_SLUG(slug));
  }
}

export async function invalidateHeaderCategoryCache() {
  await invalidateCache(CACHE_KEYS.HEADER_CATEGORIES);
}

export async function invalidateFooterConfigCache() {
  await invalidateCache(CACHE_KEYS.FOOTER_CONFIG);
}

export async function invalidatePanchangCache() {
  await invalidateCache(CACHE_KEYS.PANCHANG_TODAY);
  await invalidateCache(CACHE_KEYS.PUBLIC_CALENDAR_SHELF);
  await invalidateCache('tapa:cache:panchang:vrat:*');
}
