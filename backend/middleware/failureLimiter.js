/**
 * Bộ đếm số lần đăng nhập sai theo khóa (IP, tên đăng nhập...), lưu trong bộ nhớ.
 * Tự dọn các khóa đã hết hạn để không phình bộ nhớ.
 */
export function createFailureLimiter({ maxFailures, windowMs }) {
  const entries = new Map(); // key -> { count, resetAt }

  function pruneExpired(now) {
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key);
    }
  }

  return {
    isLocked(key) {
      const entry = entries.get(key);
      if (!entry) return false;
      if (entry.resetAt <= Date.now()) {
        entries.delete(key);
        return false;
      }
      return entry.count >= maxFailures;
    },

    record(key) {
      const now = Date.now();
      pruneExpired(now);
      const entry = entries.get(key);
      entries.set(key, entry
        ? { count: entry.count + 1, resetAt: entry.resetAt }
        : { count: 1, resetAt: now + windowMs });
    },

    clear(key) {
      entries.delete(key);
    },
  };
}
