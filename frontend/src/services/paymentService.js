/**
 * NÉT. Payment Service
 * Lấy cấu hình tài khoản nhận tiền và trạng thái thanh toán của đơn hàng
 */
import { apiClient } from './api.js';

export const paymentService = {
  /** Cấu hình tài khoản nhận tiền: { bankId, accountNo, accountName, prefix, configured } */
  async getConfig() {
    return await apiClient('/payment/config');
  },

  /** Trạng thái thanh toán của đơn: { orderId, paid, status } */
  async getStatus(orderId) {
    return await apiClient(`/payment/status/${encodeURIComponent(orderId)}`);
  },
};
