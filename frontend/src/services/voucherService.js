/**
 * NÉT. Voucher Service
 * Handles promo coupon listing and discount validation
 */
import { API_CONFIG, apiClient } from './api.js';
import { AVAILABLE_VOUCHERS } from '../data/vouchers.js';
import { applyCoupon } from '../utils/coupon.js';

export const voucherService = {
  /**
   * Get all active vouchers
   */
  async getVouchers() {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient('/vouchers');
    }
    return Promise.resolve(AVAILABLE_VOUCHERS);
  },

  /**
   * Validate voucher code and compute discount
   */
  async applyVoucher(code, subtotal) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient('/vouchers/validate', {
        method: 'POST',
        body: { code, subtotal },
      });
    }
    return Promise.resolve(applyCoupon(code, subtotal));
  }
};

