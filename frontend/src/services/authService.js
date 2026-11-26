/**
 * NÉT. Auth Service
 * Đăng ký / đăng nhập khách hàng qua backend; token phiên lưu ở localStorage và được apiClient tự gắn vào mọi request.
 */
import { apiClient, AUTH_TOKEN_KEY } from './api.js';

function saveSession(result) {
  localStorage.setItem(AUTH_TOKEN_KEY, result.token);
  return result.user;
}

export const authService = {
  /** Trả về thông tin người dùng; ném lỗi (kèm thông báo của server) nếu sai thông tin */
  async login(phone, password) {
    return saveSession(await apiClient('/auth/login', { method: 'POST', body: { phone, password } }));
  },

  async register({ fullName, phone, email, password }) {
    return saveSession(await apiClient('/auth/register', { method: 'POST', body: { fullName, phone, email, password } }));
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  hasSession() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },
};
