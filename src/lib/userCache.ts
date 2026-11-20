const CACHE_PREFIX = "lumif_ucache_v1:";

type CacheEnvelope<T> = {
  savedAt: number;
  data: T;
};

const memoryCache = new Map<string, CacheEnvelope<unknown>>();

function makeKey(userId: string, key: string): string {
  // Scope every cache entry to the exact authenticated userId
  const safeUid = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeKey = key.replace(/[^a-zA-Z0-9_:-]/g, "");
  return `${CACHE_PREFIX}${safeUid}:${safeKey}`;
}

export function readUserCache<T>(
  userId: string,
  key: string,
  ttlMs = 60_000,
  maxStaleMs = 5 * 60_000
): { data: T; isFresh: boolean } | null {
  if (!userId) return null;
  const fullKey = makeKey(userId, key);
  const now = Date.now();

  const inMem = memoryCache.get(fullKey) as CacheEnvelope<T> | undefined;
  if (inMem) {
    const age = now - inMem.savedAt;
    if (age <= maxStaleMs) {
      return { data: inMem.data, isFresh: age <= ttlMs };
    }
    memoryCache.delete(fullKey);
  }

  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(fullKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed.savedAt !== "number") return null;
    const age = now - parsed.savedAt;
    if (age > maxStaleMs) {
      window.sessionStorage.removeItem(fullKey);
      return null;
    }
    memoryCache.set(fullKey, parsed);
    return { data: parsed.data, isFresh: age <= ttlMs };
  } catch {
    return null;
  }
}

export function writeUserCache<T>(userId: string, key: string, data: T): void {
  if (!userId) return;
  const fullKey = makeKey(userId, key);
  const envelope: CacheEnvelope<T> = {
    savedAt: Date.now(),
    data,
  };
  memoryCache.set(fullKey, envelope);

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(fullKey, JSON.stringify(envelope));
    } catch {
      // Ignore storage quota errors
    }
  }
}

export function invalidateUserCache(userId?: string | null, keyPrefix?: string): void {
  const targetPrefix = userId
    ? `${CACHE_PREFIX}${userId.replace(/[^a-zA-Z0-9_-]/g, "")}:${keyPrefix ?? ""}`
    : CACHE_PREFIX;

  for (const k of Array.from(memoryCache.keys())) {
    if (k.startsWith(targetPrefix)) {
      memoryCache.delete(k);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith(targetPrefix)) {
          toRemove.push(k);
        }
      }
      for (const k of toRemove) {
        window.sessionStorage.removeItem(k);
      }
    } catch {
      // Ignore
    }
  }
}

export function clearAllUserCaches(): void {
  invalidateUserCache(null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("lumif:data-updated"));
  }
}

export function notifyUserDataUpdated(userId?: string | null): void {
  if (userId) {
    invalidateUserCache(userId);
  } else {
    invalidateUserCache(null);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("lumif:data-updated"));
  }
}
