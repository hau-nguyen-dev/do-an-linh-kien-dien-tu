import { AVAILABLE_VOUCHERS } from '../data/vouchers.js';
import { formatVND } from './formatters.js';

/**
 * Kiểm tra và áp dụng mã giảm giá / voucher
 */
export function applyCoupon(code, subtotal, shippingFee = 30000) {
  if (!code) return { valid: false, discountAmount: 0, message: 'Vui lòng nhập mã giảm giá' };
  
  const voucher = AVAILABLE_VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
  if (!voucher) {
    return { valid: false, discountAmount: 0, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' };
  }

  if (subtotal < voucher.minOrder) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Đơn hàng tối thiểu ${formatVND(voucher.minOrder)} để áp dụng mã này`,
    };
  }

  let discountAmount = 0;
  if (voucher.discountType === 'fixed') {
    discountAmount = voucher.value;
  } else if (voucher.discountType === 'shipping') {
    discountAmount = Math.min(shippingFee, voucher.value);
  } else if (voucher.discountType === 'percent') {
    discountAmount = Math.min(Math.round((subtotal * voucher.value) / 100), voucher.maxDiscount || Infinity);
  }

  return {
    valid: true,
    discountAmount,
    voucher,
    message: `Đã áp dụng mã ${voucher.code}: ${voucher.desc}`,
  };
}
