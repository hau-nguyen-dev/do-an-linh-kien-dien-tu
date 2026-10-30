/**
 * NÉT. API Client & Adapter Configuration
 * Switch between Local Mock / localStorage and Backend REST API (Node.js, FastAPI, Spring)
 */

export const API_CONFIG = {
  // Bật kết nối Backend thật 100%
  USE_BACKEND_API: true,
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT_MS: 10000,
  HEADERS: {}
};

/**
 * Universal API Client Wrapper
 * Handles Authorization headers, status code checking, and timeout
 */
export async function apiClient(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  if (!API_CONFIG.USE_BACKEND_API) {
    throw new Error('[API] Backend integration is currently turned off. Please enable API_CONFIG.USE_BACKEND_API.');
  }

  const token = localStorage.getItem('net_auth_token');
  const authHeaders = (token && method !== 'GET') ? { 'Authorization': `Bearer ${token}` } : {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  // Chỉ gắn Content-Type khi có body (tránh kích hoạt preflight OPTIONS của Chrome trên file:///)
  const reqHeaders = {
    ...API_CONFIG.HEADERS,
    ...authHeaders,
    ...headers,
  };
  if (body && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const error = new Error(errBody.message || `Lỗi máy chủ HTTP ${response.status}`);
      error.status = response.status;
      error.data = errBody;
      throw error;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Kết nối đến Backend quá thời gian chờ (${API_CONFIG.TIMEOUT_MS}ms)`);
    }
    throw err;
  }
}

