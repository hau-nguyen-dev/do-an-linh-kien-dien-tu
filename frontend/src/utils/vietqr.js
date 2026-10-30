/**
 * Tạo URL ảnh mã VietQR thanh toán ngân hàng chuẩn Napas 247
 */
export function generateVietQRUrl({
  bankId = 'MB',
  accountNo = '0901234567',
  accountName = 'NET STORE VN',
  amount = 0,
  memo = ''
}) {
  const encodedName = encodeURIComponent(accountName);
  const encodedMemo = encodeURIComponent(memo || 'THANH TOAN DON HANG NET');
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodedMemo}&accountName=${encodedName}`;
}
