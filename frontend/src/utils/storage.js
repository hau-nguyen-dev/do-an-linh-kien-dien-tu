/**
 * Tiện ích đọc localStorage an toàn với JSON serialization
 */
export function getStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Tiện ích ghi localStorage an toàn với JSON serialization
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
}
