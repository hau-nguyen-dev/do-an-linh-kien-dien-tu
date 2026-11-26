/**
 * NÉT. API Client & Adapter Configuration
 * Switch between Local Mock / localStorage and Backend REST API (Node.js, FastAPI, Spring)
 */

// Khi được Express phục vụ qua http(s) (local hoặc đã deploy) thì gọi API cùng origin;
// khi mở file:/// hoặc chạy Vite dev (cổng 5173) thì trỏ về backend cổng 5000.
function resolveApiBaseUrl() {
  const isServedByBackend = typeof location !== 'undefined'
    && location.protocol.startsWith('http')
    && location.port !== '5173';
  return isServedByBackend ? `${location.origin}/api` : 'http://localhost:5000/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

// Khóa localStorage chứa token phiên đăng nhập của khách hàng
export const AUTH_TOKEN_KEY = 'net_auth_token';

export const API_CONFIG = {
  // Bật kết nối Backend thật 100%
  USE_BACKEND_API: true,
  BASE_URL: API_BASE_URL,
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

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

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
      if (response.status === 401 && token) {
        // Token hết hạn hoặc không còn hợp lệ: xóa và báo cho ứng dụng đăng xuất
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.dispatchEvent(new Event('net-auth-expired'));
      }
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

