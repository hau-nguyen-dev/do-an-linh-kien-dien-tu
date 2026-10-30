/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam Đồng (VND)
 */
export function formatVND(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Tạo mã đơn hàng ngẫu nhiên duy nhất định dạng NET-XXXXX
 */
export function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NET-${rand}`;
}
