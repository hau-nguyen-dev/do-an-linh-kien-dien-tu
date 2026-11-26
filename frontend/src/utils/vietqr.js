/**
 * Tạo URL ảnh mã VietQR thanh toán ngân hàng chuẩn Napas 247.
 * Thông tin tài khoản lấy từ cấu hình của cửa hàng (admin quản lý), không có giá trị mặc định giả.
 */
export function generateVietQRUrl({ bankId, accountNo, accountName, amount = 0, memo = '' }) {
  if (!bankId || !accountNo) return '';
  const params = new URLSearchParams({
    amount: String(Math.round(Number(amount) || 0)),
    addInfo: memo,
    accountName: accountName || '',
  });
  return `https://img.vietqr.io/image/${encodeURIComponent(bankId)}-${encodeURIComponent(accountNo)}-compact2.png?${params.toString()}`;
}
