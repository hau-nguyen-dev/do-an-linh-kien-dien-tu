// Kiểm thử tích hợp: đăng nhập admin/khách, bảo vệ API, cấu hình nhận tiền, ảnh mã QR, xác nhận thanh toán thủ công.
// Chạy: node tools/test_payment_webhook.mjs  (dùng bản sao CSDL trong thư mục tạm, không đụng database.sqlite thật)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createServer } from 'node:http';
import { createHmac } from 'node:crypto';
import { signPaymentRequest, signWebhookData } from '../backend/services/payos.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5055;
const PAYOS_PORT = 5056;
const PAYOS_KEYS = { PAYOS_CLIENT_ID: 'test-client', PAYOS_API_KEY: 'test-key', PAYOS_CHECKSUM_KEY: 'test-checksum' };
let fakePayos;
let payosFailing = false;
const payosRequests = [];
const BASE = `http://127.0.0.1:${PORT}/api`;
const ADMIN = { username: 'testadmin', password: 'Matkhau-Test-123' };

let server;
let tmpDir;
let adminToken;

async function call(method, url, { body, headers = {}, token } = {}) {
  const res = await fetch(BASE + url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

let phoneCounter = 0;

// Mỗi đơn dùng một số điện thoại mới vì server giới hạn 1 đơn / 15 giây / số điện thoại
let p1Price;
let productId;

// Lấy một sản phẩm thật trong CSDL để đặt hàng (giá do server kiểm tra theo bảng san_pham)
async function loadProduct() {
  if (productId) return;
  const products = (await call('GET', '/products')).data;
  const first = products.find((p) => Number(p.price) > 0);
  assert.ok(first, 'CSDL cần có ít nhất một sản phẩm');
  productId = first.id;
  p1Price = Number(first.price);
}

// Đơn dùng đúng giá sản phẩm p1 trong CSDL (server tính lại giá, không tin tổng tiền khách gửi)
async function createVietQrOrder(quantity = 1, overrides = {}) {
  await loadProduct();
  const total = p1Price * quantity;
  phoneCounter += 1;
  const phone = `09100000${String(phoneCounter).padStart(2, '0')}`;
  const reg = await call('POST', '/auth/register', { body: { phone, fullName: 'Khach Test', password: 'abc12345' } });
  assert.equal(reg.status, 201, JSON.stringify(reg.data));
  const res = await call('POST', '/orders', {
    token: reg.data.token,
    body: {
      phone, address: 'Hue', paymentMethod: 'vietqr', total, subtotal: total,
      items: [{ id: productId, name: 'SP test', price: p1Price, quantity }],
      ...overrides,
    },
  });
  assert.equal(res.status, 201, JSON.stringify(res.data));
  return { ...res.data, customerToken: reg.data.token };
}

before(async () => {
  tmpDir = mkdtempSync(path.join(tmpdir(), 'net-test-'));
  // Bản mẫu sạch seed.sqlite (cũng là nguồn server dùng để tự khởi tạo CSDL lần đầu)
  copyFileSync(path.join(root, 'backend', 'seed.sqlite'), path.join(tmpDir, 'test.sqlite'));
  // payOS giả: ghi lại yêu cầu tạo link và trả về thông tin tài khoản như payOS thật
  fakePayos = createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      const body = raw ? JSON.parse(raw) : {};
      payosRequests.push({ url: req.url, headers: req.headers, body });
      res.setHeader('Content-Type', 'application/json');
      if (payosFailing && req.url === '/v2/payment-requests') {
        res.statusCode = 500;
        return res.end(JSON.stringify({ code: '20', desc: 'payOS tạm lỗi' }));
      }
      res.end(JSON.stringify({
        code: '00', desc: 'success',
        data: {
          bin: '970422', accountNumber: '0123456789', accountName: 'NET STORE', amount: body.amount,
          description: body.description, orderCode: body.orderCode, currency: 'VND',
          paymentLinkId: `link-${body.orderCode}`, status: 'PENDING', checkoutUrl: `https://pay.payos.vn/web/link-${body.orderCode}`,
          qrCode: '000201...',
        },
      }));
    });
  });
  await new Promise((resolve) => fakePayos.listen(PAYOS_PORT, '127.0.0.1', resolve));
  server = spawn(process.execPath, [path.join(root, 'backend', 'server.js')], {
    env: {
      ...process.env,
      ...PAYOS_KEYS,
      PAYOS_API_BASE: `http://127.0.0.1:${PAYOS_PORT}`,
      PUBLIC_BASE_URL: 'https://shop.test',
      PORT: String(PORT),
      DB_PATH: path.join(tmpDir, 'test.sqlite'),
      ADMIN_USERNAME: ADMIN.username,
      ADMIN_PASSWORD: ADMIN.password,
      ADMIN_TOKEN_SECRET: 'test-secret',
    },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i += 1) {
    try { if ((await fetch(`${BASE}/health`)).ok) break; } catch { /* server chưa sẵn sàng */ }
    await new Promise((r) => setTimeout(r, 200));
  }
});

after(async () => {
  if (server) {
    const exited = new Promise((resolve) => server.once('exit', resolve));
    server.kill();
    await exited; // Windows giữ khóa file SQLite đến khi tiến trình thoát hẳn
  }
  if (fakePayos) await new Promise((resolve) => fakePayos.close(resolve));
  rmSync(tmpDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
});

test('admin login: sai mật khẩu bị từ chối, đúng mật khẩu nhận token', async () => {
  const bad = await call('POST', '/admin/login', { body: { username: ADMIN.username, password: 'sai-mat-khau' } });
  assert.equal(bad.status, 401);
  const ok = await call('POST', '/admin/login', { body: ADMIN });
  assert.equal(ok.status, 200);
  assert.ok(ok.data.token);
  adminToken = ok.data.token;
  assert.equal((await call('GET', '/admin/me', { token: adminToken })).status, 200);
  assert.equal((await call('GET', '/admin/me', { token: adminToken + 'x' })).status, 401);
});

test('API ghi cần token admin, API công khai của khách vẫn dùng được', async () => {
  assert.equal((await call('PUT', '/settings', { body: { hotline: '1' } })).status, 401);
  assert.equal((await call('DELETE', '/products/p1')).status, 401);
  assert.equal((await call('PUT', '/payment/config', { body: {} })).status, 401);
  assert.equal((await call('POST', '/vouchers/validate', { body: { code: 'X', subtotal: 1 } })).status, 200);
  assert.equal((await call('PUT', '/settings', { body: { hotline: '1900' }, token: adminToken })).status, 200);
});

test('cấu hình ngân hàng: kiểm tra dữ liệu và lưu thành công', async () => {
  const bad = await call('PUT', '/payment/config', { token: adminToken, body: { bankId: 'MB', accountNo: 'abc', accountName: 'NET STORE' } });
  assert.equal(bad.status, 400);
  const ok = await call('PUT', '/payment/config', {
    token: adminToken, body: { bankId: 'MB', accountNo: '0123456789', accountName: 'nguyen van a' },
  });
  assert.equal(ok.status, 200);
  const cfg = (await call('GET', '/payment/config')).data;
  assert.deepEqual(
    { bankId: cfg.bankId, accountNo: cfg.accountNo, accountName: cfg.accountName, configured: cfg.configured },
    { bankId: 'MB', accountNo: '0123456789', accountName: 'NGUYEN VAN A', configured: true },
  );
});

test('đơn hàng: mã do server cấp dạng NET + 8 số; danh sách toàn bộ đơn cần admin', async () => {
  const order = await createVietQrOrder();
  assert.match(order.orderId, /^NET\d{8}$/);
  assert.equal(order.isPaid, false);
  assert.deepEqual((await call('GET', '/orders')).data, []);
  const all = await call('GET', '/orders', { token: adminToken });
  assert.ok(all.data.some((o) => o.orderId === order.orderId));
  const mine = await call('GET', `/orders?phone=${order.phone}`, { token: order.customerToken });
  assert.ok(mine.data.some((o) => o.orderId === order.orderId));
});

test('xác nhận thủ công: cần admin, đánh dấu đã thanh toán', async () => {
  const order = await createVietQrOrder();
  assert.equal((await call('POST', `/payment/orders/${order.orderId}/confirm`)).status, 401);
  assert.equal((await call('POST', `/payment/orders/${order.orderId}/confirm`, { token: adminToken })).status, 200);
  assert.equal((await call('GET', `/payment/status/${order.orderId}`)).data.paid, true);
});

test('đơn hàng: từ chối giá thấp hơn bảng giá, tổng tiền sai và bỏ qua trạng thái do khách gửi', async () => {
  await loadProduct();
  const reg99 = await call('POST', '/auth/register', { body: { phone: '0910000099', fullName: 'Khach Test', password: 'abc12345' } });
  const cheat = await call('POST', '/orders', { token: reg99.data.token, body: {
    phone: '0910000099', address: 'Hue', paymentMethod: 'vietqr', total: 1, subtotal: 1,
    items: [{ id: productId, name: 'SP test', price: 1, quantity: 1 }],
  } });
  assert.equal(cheat.status, 400);

  const reg98 = await call('POST', '/auth/register', { body: { phone: '0910000098', fullName: 'Khach Test', password: 'abc12345' } });
  const wrongTotal = await call('POST', '/orders', { token: reg98.data.token, body: {
    phone: '0910000098', address: 'Hue', paymentMethod: 'vietqr', total: 1, subtotal: p1Price,
    items: [{ id: productId, name: 'SP test', price: p1Price, quantity: 1 }],
  } });
  assert.equal(wrongTotal.status, 400);

  const forged = await createVietQrOrder(1, { status: 'Đã giao hàng' });
  assert.equal(forged.status, 'Chờ thanh toán QR');
});

test('đọc chi tiết đơn cần đúng số điện thoại hoặc quyền admin; PUT /settings không đổi được tài khoản ngân hàng', async () => {
  const order = await createVietQrOrder();
  assert.equal((await call('GET', `/orders/${order.orderId}`)).status, 404);
  assert.equal((await call('GET', `/orders/${order.orderId}?phone=${order.phone}`)).status, 404);
  assert.equal((await call('GET', `/orders/${order.orderId}`, { token: order.customerToken })).status, 200);
  assert.equal((await call('GET', `/orders/${order.orderId}`, { token: adminToken })).status, 200);

  await call('PUT', '/settings', { token: adminToken, body: { bank_account_no: '111111111', hotline: '1900' } });
  assert.equal((await call('GET', '/payment/config')).data.accountNo, '0123456789');
});

const register = (phone, name = 'Khach A', password = 'matkhau-dai-1') =>
  call('POST', '/auth/register', { body: { phone, fullName: name, password } });

test('khách hàng: mật khẩu được băm, từ chối mật khẩu yếu, nâng cấp mật khẩu cũ khi đăng nhập', async () => {
  const reg = await register('0920000001');
  assert.equal(reg.status, 201);
  assert.ok(reg.data.token);
  assert.equal(JSON.stringify(reg.data).includes('matkhau-dai-1'), false);
  assert.equal((await register('0920000002', 'B', '123')).status, 400);
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000001', password: 'sai-mat-khau' } })).status, 401);
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000001', password: 'matkhau-dai-1' } })).status, 200);

  const dbFile = path.join(tmpDir, 'test.sqlite');
  const legacyDb = new DatabaseSync(dbFile);
  legacyDb.prepare("INSERT INTO nguoi_dung (id, ho_ten, so_dien_thoai, mat_khau) VALUES ('Ulegacy', 'Cu', '0920000003', 'matkhau-cu')").run();
  legacyDb.close();
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000003', password: 'matkhau-cu' } })).status, 200);
  const checkDb = new DatabaseSync(dbFile, { readOnly: true });
  const stored = checkDb.prepare("SELECT mat_khau FROM nguoi_dung WHERE so_dien_thoai = '0920000003'").get().mat_khau;
  checkDb.close();
  assert.ok(stored.startsWith('scrypt$'));
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000003', password: 'matkhau-cu' } })).status, 200);
});

test('khách hàng chỉ xem và sửa được dữ liệu của chính mình; token admin và khách không dùng chéo', async () => {
  const a = await register('0920000011', 'Khach A');
  const b = await register('0920000012', 'Khach B');

  assert.equal((await call('PUT', '/auth/profile', { body: { phone: '0920000012', fullName: 'Hacker' } })).status, 401);
  assert.equal((await call('GET', '/auth/me')).status, 401);
  await call('PUT', '/auth/profile', { token: a.data.token, body: { phone: '0920000012', fullName: 'Ten Moi A' } });
  assert.equal((await call('GET', '/auth/me', { token: b.data.token })).data.name, 'Khach B');
  assert.equal((await call('GET', '/auth/me', { token: a.data.token })).data.name, 'Ten Moi A');

  assert.equal((await call('GET', '/orders?phone=0920000012', { token: a.data.token })).status, 401);
  assert.equal((await call('GET', '/orders?phone=0920000012')).status, 401);

  const noCurrent = await call('PUT', '/auth/profile', { token: a.data.token, body: { password: 'matkhau-moi-22' } });
  assert.equal(noCurrent.status, 401);
  const changed = await call('PUT', '/auth/profile', { token: a.data.token, body: { password: 'matkhau-moi-22', currentPassword: 'matkhau-dai-1' } });
  assert.equal(changed.status, 200);
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000011', password: 'matkhau-moi-22' } })).status, 200);

  assert.equal((await call('PUT', '/settings', { token: a.data.token, body: { hotline: '1' } })).status, 401);
  assert.equal((await call('GET', '/admin/me', { token: a.data.token })).status, 401);
  assert.equal((await call('POST', '/orders', { token: adminToken, body: { items: [] } })).status, 401);
});

test('khách hàng: sai mật khẩu 5 lần thì bị khóa tạm thời kể cả khi nhập đúng', async () => {
  await register('0920000021');
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000021', password: 'sai-mat-khau' } })).status, 401);
  }
  assert.equal((await call('POST', '/auth/login', { body: { phone: '0920000021', password: 'matkhau-dai-1' } })).status, 429);
});

// Ảnh PNG 1x1 hợp lệ
const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

test('ảnh mã QR: chỉ admin tải lên, chỉ nhận PNG/JPEG/WebP, khách xem được ảnh và gỡ ảnh được', async () => {
  assert.equal((await call('PUT', '/payment/qr-image', { body: { image: TINY_PNG } })).status, 401);
  assert.equal((await call('PUT', '/payment/qr-image', { token: adminToken, body: { image: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' } })).status, 400);
  assert.equal((await call('PUT', '/payment/qr-image', { token: adminToken, body: { image: 'khong-phai-anh' } })).status, 400);
  assert.equal((await call('PUT', '/payment/qr-image', { token: adminToken, body: { image: 'data:image/png;base64,' + 'A'.repeat(2_100_000) } })).status, 413);

  const up = await call('PUT', '/payment/qr-image', { token: adminToken, body: { image: TINY_PNG } });
  assert.equal(up.status, 200);
  assert.equal(up.data.config.hasQrImage, true);

  const cfg = (await call('GET', '/payment/config')).data;
  assert.equal(cfg.hasQrImage, true);
  assert.ok(cfg.qrImageVersion);
  assert.equal('payment_qr_image' in (await call('GET', '/settings')).data, false);

  const img = await fetch(`${BASE}/payment/qr-image`);
  assert.equal(img.status, 200);
  assert.equal(img.headers.get('content-type'), 'image/png');
  assert.ok((await img.arrayBuffer()).byteLength > 20);

  assert.equal((await call('DELETE', '/payment/qr-image')).status, 401);
  assert.equal((await call('DELETE', '/payment/qr-image', { token: adminToken })).status, 200);
  assert.equal((await fetch(`${BASE}/payment/qr-image`)).status, 404);
});

test('tài khoản nhận tiền: có thể chỉ dùng ảnh QR (để trống thông tin ngân hàng) nhưng không được nhập thiếu', async () => {
  const partial = await call('PUT', '/payment/config', { token: adminToken, body: { bankId: 'SHB', accountNo: '', accountName: '' } });
  assert.equal(partial.status, 400);
  await call('PUT', '/payment/qr-image', { token: adminToken, body: { image: TINY_PNG } });
  const cleared = await call('PUT', '/payment/config', { token: adminToken, body: {} });
  assert.equal(cleared.status, 200);
  assert.equal(cleared.data.config.hasBankInfo, false);
  assert.equal(cleared.data.config.configured, true);
});

// ---------------------------------------------------------------- payOS: thanh toán QR tự động

const signedWebhook = (data, overrides = {}) => ({
  code: '00', desc: 'success', success: true, data, signature: signWebhookData(data, PAYOS_KEYS.PAYOS_CHECKSUM_KEY), ...overrides,
});
const webhookData = (order, extra = {}) => ({
  orderCode: Number(order.orderId.replace(/\D/g, '')), amount: order.total, description: `N${order.orderId.replace(/\D/g, '')}`,
  accountNumber: '0123456789', reference: 'FT-TEST-1', transactionDateTime: '2026-11-27 10:00:00', currency: 'VND',
  paymentLinkId: `link-${order.orderId.replace(/\D/g, '')}`, code: '00', desc: 'success', counterAccountBankId: '', counterAccountName: null, ...extra,
});

test('payOS: đơn VietQR tự tạo link, gửi đúng chữ ký và lưu tài khoản nhận tiền riêng cho đơn', async () => {
  const order = await createVietQrOrder();
  const orderCode = Number(order.orderId.replace(/\D/g, ''));
  assert.equal(order.payos.accountNumber, '0123456789');
  assert.equal(order.payos.description, `N${orderCode}`);
  const sent = payosRequests.find((r) => r.body.orderCode === orderCode);
  assert.equal(sent.url, '/v2/payment-requests');
  assert.equal(sent.headers['x-client-id'], PAYOS_KEYS.PAYOS_CLIENT_ID);
  assert.equal(sent.headers['x-api-key'], PAYOS_KEYS.PAYOS_API_KEY);
  assert.equal(sent.body.amount, order.total);
  assert.equal(sent.body.signature, signPaymentRequest(sent.body, PAYOS_KEYS.PAYOS_CHECKSUM_KEY));
});

test('payOS webhook: sai chữ ký bị từ chối, đơn chưa được đánh dấu đã thanh toán', async () => {
  const order = await createVietQrOrder();
  const forged = signedWebhook(webhookData(order), { signature: 'f'.repeat(64) });
  assert.equal((await call('POST', '/payment/payos-webhook', { body: forged })).status, 401);
  assert.equal((await call('POST', '/payment/payos-webhook', { body: { success: true } })).status, 401);
  assert.equal((await call('GET', `/payment/status/${order.orderId}`)).data.paid, false);
});

test('payOS webhook: đúng chữ ký và đủ tiền thì đơn tự chuyển sang đã thanh toán; gửi lại không đổi gì', async () => {
  const order = await createVietQrOrder();
  const hook = signedWebhook(webhookData(order));
  assert.equal((await call('POST', '/payment/payos-webhook', { body: hook })).status, 200);
  const status = (await call('GET', `/payment/status/${order.orderId}`)).data;
  assert.equal(status.paid, true);
  assert.equal(status.status, 'Đang xử lý');
  const detail = (await call('GET', `/orders/${order.orderId}`, { token: adminToken })).data;
  assert.equal(detail.bankTransactionId, 'PAYOS-FT-TEST-1');
  const firstPaidAt = detail.paidAt;
  assert.equal((await call('POST', '/payment/payos-webhook', { body: hook })).status, 200);
  assert.equal((await call('GET', `/orders/${order.orderId}`, { token: adminToken })).data.paidAt, firstPaidAt);
});

test('payOS webhook: sai số tiền hoặc giao dịch thất bại không đánh dấu đã thanh toán', async () => {
  const wrongAmount = await createVietQrOrder();
  const res = await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(wrongAmount, { amount: 1000 })) });
  assert.equal(res.status, 200);
  assert.equal((await call('GET', `/payment/status/${wrongAmount.orderId}`)).data.paid, false);

  const failed = await createVietQrOrder();
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(failed, { code: '01' })) });
  assert.equal((await call('GET', `/payment/status/${failed.orderId}`)).data.paid, false);
});

test('payOS webhook: giao dịch mẫu khi xác nhận URL (đơn không tồn tại) vẫn trả 200', async () => {
  const sample = { orderCode: 123, amount: 3000, description: 'VQRIO123', reference: 'TF230204212323', currency: 'VND', paymentLinkId: 'abc', code: '00', desc: 'success' };
  assert.equal((await call('POST', '/payment/payos-webhook', { body: signedWebhook(sample) })).status, 200);
});

test('payOS: chỉ admin được đăng ký webhook, và luôn dùng PUBLIC_BASE_URL (bỏ qua URL khách/admin gửi lên)', async () => {
  assert.equal((await call('POST', '/payment/payos/confirm-webhook', { body: {} })).status, 401);
  const ok = await call('POST', '/payment/payos/confirm-webhook', { token: adminToken, body: { webhookUrl: 'https://evil.test/hook' } });
  assert.equal(ok.status, 200);
  const sent = payosRequests.find((r) => r.url === '/confirm-webhook');
  assert.equal(sent.body.webhookUrl, 'https://shop.test/api/payment/payos-webhook');
});

test('chữ ký payOS khớp công thức trong tài liệu (tính độc lập, không dùng hàm của server)', () => {
  const hmac = (text) => createHmac('sha256', 'k').update(text).digest('hex');
  const data = { orderCode: 123, amount: 3000, description: 'VQRIO123', counterAccountName: null };
  assert.equal(signWebhookData(data, 'k'), hmac('amount=3000&counterAccountName=&description=VQRIO123&orderCode=123'));
  const request = { amount: 3000, cancelUrl: 'https://a.test/c', description: 'N1', orderCode: 1, returnUrl: 'https://a.test/r' };
  assert.equal(signPaymentRequest(request, 'k'), hmac('amount=3000&cancelUrl=https://a.test/c&description=N1&orderCode=1&returnUrl=https://a.test/r'));
});

test('payOS lỗi khi tạo link: đơn vẫn được tạo và quay về QR thủ công', async () => {
  payosFailing = true;
  try {
    const order = await createVietQrOrder();
    assert.equal(order.payos, null);
    assert.equal(order.isPaid, false);
  } finally {
    payosFailing = false;
  }
});

test('payOS webhook: link khác, sai số tiền, trả thừa đều không tự thanh toán và được gắn cảnh báo đối soát', async () => {
  const adminView = async (order) => (await call('GET', `/orders/${order.orderId}`, { token: adminToken })).data;

  const otherLink = await createVietQrOrder();
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(otherLink, { paymentLinkId: 'link-khac' })) });
  const otherLinkView = await adminView(otherLink);
  assert.equal(otherLinkView.isPaid, false);
  assert.match(otherLinkView.payosWarning, /link thanh toán khác/);

  const wrongAmount = await createVietQrOrder();
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(wrongAmount, { amount: 1000 })) });
  assert.match((await adminView(wrongAmount)).payosWarning, /Nhận 1000đ/);

  const overpaid = await createVietQrOrder();
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(overpaid)) });
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(overpaid)) });
  assert.equal((await adminView(overpaid)).payosWarning, '', 'gửi lại cùng giao dịch không phải trả thừa');
  await call('POST', '/payment/payos-webhook', { body: signedWebhook(webhookData(overpaid, { reference: 'FT-TEST-2' })) });
  assert.match((await adminView(overpaid)).payosWarning, /đã thanh toán/);
});

test('hủy đơn hoặc xóa đơn chưa thanh toán thì hủy luôn link payOS', async () => {
  const cancelRequestsFor = (order) => payosRequests.filter((r) => r.url === `/v2/payment-requests/${order.orderId.replace(/\D/g, '')}/cancel`);
  const waitForCancel = async (order) => {
    for (let i = 0; i < 20 && cancelRequestsFor(order).length === 0; i += 1) await new Promise((r) => setTimeout(r, 100));
    return cancelRequestsFor(order);
  };

  const cancelled = await createVietQrOrder();
  await call('PUT', `/orders/${cancelled.orderId}/status`, { token: adminToken, body: { status: 'Đã hủy' } });
  assert.equal((await waitForCancel(cancelled)).length, 1);

  const deleted = await createVietQrOrder();
  await call('DELETE', `/orders/${deleted.orderId}`, { token: adminToken });
  assert.equal((await waitForCancel(deleted)).length, 1);
});

test('payOS webhook: body quá lớn bị từ chối trước khi xử lý', async () => {
  const res = await fetch(`${BASE}/payment/payos-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filler: 'x'.repeat(20_000) }),
  });
  assert.ok(res.status >= 400, `nhận ${res.status}`);
});

test('không cấu hình payOS: payosEnabled=false và webhook trả 503 (luồng QR thủ công là mặc định)', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'net-nopayos-'));
  copyFileSync(path.join(root, 'backend', 'seed.sqlite'), path.join(dir, 'test.sqlite'));
  const port = 5057;
  const proc = spawn(process.execPath, [path.join(root, 'backend', 'server.js')], {
    env: {
      ...process.env,
      PAYOS_CLIENT_ID: '', PAYOS_API_KEY: '', PAYOS_CHECKSUM_KEY: '',
      PORT: String(port), DB_PATH: path.join(dir, 'test.sqlite'),
      ADMIN_USERNAME: ADMIN.username, ADMIN_PASSWORD: ADMIN.password, ADMIN_TOKEN_SECRET: 'test-secret',
    },
    stdio: 'ignore',
  });
  try {
    const base = `http://127.0.0.1:${port}/api`;
    for (let i = 0; i < 50; i += 1) {
      try { if ((await fetch(`${base}/health`)).ok) break; } catch { /* server chưa sẵn sàng */ }
      await new Promise((r) => setTimeout(r, 200));
    }
    assert.equal((await (await fetch(`${base}/payment/config`)).json()).payosEnabled, false);
    const hook = await fetch(`${base}/payment/payos-webhook`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(signedWebhook({ orderCode: 1 })),
    });
    assert.equal(hook.status, 503);
  } finally {
    const exited = new Promise((resolve) => proc.once('exit', resolve));
    proc.kill();
    await exited;
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
});
