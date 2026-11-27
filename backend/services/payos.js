import crypto from 'node:crypto';

// Tích hợp payOS qua REST API (không cần SDK). Tài liệu: https://payos.vn/docs/api/
const DEFAULT_API_BASE = 'https://api-merchant.payos.vn';
const REQUEST_TIMEOUT_MS = 5_000;
const ORDER_ID_PREFIX = 'NET';
const ORDER_ID_DIGITS = 8;
const PAYMENT_SUCCESS_CODE = '00';
const BLANK_VALUES = new Set(['null', 'undefined']);

function credentials() {
  return {
    clientId: process.env.PAYOS_CLIENT_ID || '',
    apiKey: process.env.PAYOS_API_KEY || '',
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || '',
  };
}

export function isPayosConfigured() {
  const { clientId, apiKey, checksumKey } = credentials();
  return Boolean(clientId && apiKey && checksumKey);
}

function hmacHex(text, checksumKey) {
  return crypto.createHmac('sha256', checksumKey).update(text).digest('hex');
}

// Chữ ký khi tạo link: 5 trường, sắp theo alphabet
export function signPaymentRequest({ amount, cancelUrl, description, orderCode, returnUrl }, checksumKey) {
  const text = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  return hmacHex(text, checksumKey);
}

function stringifyValue(value) {
  if (value === null || value === undefined || BLANK_VALUES.has(value)) return '';
  return Array.isArray(value) ? JSON.stringify(value) : String(value);
}

// Chữ ký webhook: sắp key của object data theo alphabet, nối key=value bằng &
export function signWebhookData(data, checksumKey) {
  const text = Object.keys(data)
    .sort()
    .map((key) => `${key}=${stringifyValue(data[key])}`)
    .join('&');
  return hmacHex(text, checksumKey);
}

export function verifyWebhook(payload, checksumKey = credentials().checksumKey) {
  if (!checksumKey || !payload || typeof payload.data !== 'object' || payload.data === null) return false;
  const received = Buffer.from(String(payload.signature || ''), 'utf8');
  const expected = Buffer.from(signWebhookData(payload.data, checksumKey), 'utf8');
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

export function isSuccessfulPayment(payload) {
  return payload?.success === true && payload?.data?.code === PAYMENT_SUCCESS_CODE;
}

async function callPayos(method, pathname, body) {
  const { clientId, apiKey } = credentials();
  // PAYOS_API_BASE chỉ dùng cho kiểm thử; ở production luôn gọi payOS thật để khóa API không bị gửi tới host lạ
  const override = process.env.NODE_ENV === 'production' ? '' : process.env.PAYOS_API_BASE;
  const apiBase = override || DEFAULT_API_BASE;
  const res = await fetch(apiBase + pathname, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-client-id': clientId, 'x-api-key': apiKey },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code !== PAYMENT_SUCCESS_CODE) {
    throw new Error(`payOS ${pathname} thất bại (${res.status}): ${json.desc || 'không rõ lỗi'}`);
  }
  return json.data;
}

/** Tạo link thanh toán; trả về thông tin tài khoản nhận tiền do payOS cấp riêng cho đơn. */
export async function createPaymentLink({ orderCode, amount, description, returnUrl, cancelUrl, items, buyerName, buyerPhone }) {
  const { checksumKey } = credentials();
  const signature = signPaymentRequest({ amount, cancelUrl, description, orderCode, returnUrl }, checksumKey);
  const data = await callPayos('POST', '/v2/payment-requests', {
    orderCode, amount, description, returnUrl, cancelUrl, items, buyerName, buyerPhone, signature,
  });
  return {
    paymentLinkId: data.paymentLinkId,
    checkoutUrl: data.checkoutUrl,
    bin: data.bin,
    accountNumber: data.accountNumber,
    accountName: data.accountName,
    description: data.description,
  };
}

/** Hủy link thanh toán của đơn (khi đơn bị hủy). */
export function cancelPaymentLink(orderCode, reason) {
  return callPayos('POST', `/v2/payment-requests/${orderCode}/cancel`, { cancellationReason: reason });
}

// payOS cần orderCode dạng số: dùng đúng 8 chữ số của mã đơn NETxxxxxxxx (duy nhất vì mã đơn duy nhất)
export function payosOrderCodeOf(orderId) {
  return Number(String(orderId).replace(/\D/g, ''));
}

/** Mã đơn NETxxxxxxxx ứng với orderCode của payOS; undefined nếu không đúng định dạng 8 chữ số. */
export function orderIdFromPayosCode(orderCode) {
  const digits = String(orderCode);
  return new RegExp(`^\\d{${ORDER_ID_DIGITS}}$`).test(digits) ? ORDER_ID_PREFIX + digits : undefined;
}

/**
 * Địa chỉ công khai của cửa hàng, dùng cho returnUrl/cancelUrl và webhook.
 * Production bắt buộc đặt PUBLIC_BASE_URL (không tin header Host do khách gửi); trả null nếu thiếu.
 */
export function getPublicBaseUrl(req) {
  const configured = (process.env.PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') return null;
  return `${req.protocol}://${req.get('host')}`;
}

/** Đăng ký webhook URL với payOS (payOS sẽ gửi một giao dịch mẫu để kiểm tra). */
export function confirmWebhookUrl(webhookUrl) {
  return callPayos('POST', '/confirm-webhook', { webhookUrl });
}
