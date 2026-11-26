import crypto from 'node:crypto';
import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

const AWAITING_PAYMENT_STATUSES = new Set([
  'Chờ thanh toán VietQR', 'Chờ thanh toán QR', 'pending_qr', 'Chờ xác nhận', 'pending',
]);
const PAID_STATUS = 'Đang xử lý';

const BANK_ID_PATTERN = /^[A-Za-z0-9]{2,20}$/;
const ACCOUNT_NO_PATTERN = /^\d{6,20}$/;
const ACCOUNT_NAME_PATTERN = /^[A-Z0-9 ]{3,50}$/;
const QR_IMAGE_PATTERN = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+=*)$/;
const MAX_QR_IMAGE_CHARS = 2_000_000; // ~1,5MB ảnh sau khi mã hóa base64

const SETTING_KEYS = {
  bankId: 'bank_id',
  accountNo: 'bank_account_no',
  accountName: 'bank_account_name',
  qrImage: 'payment_qr_image',
};

// ---------------------------------------------------------------- cấu hình nhận tiền

function readSetting(key) {
  return db.prepare('SELECT gia_tri FROM cai_dat_cua_hang WHERE khoa = ?').get(key)?.gia_tri || '';
}

function readConfig() {
  const config = {
    bankId: readSetting(SETTING_KEYS.bankId),
    accountNo: readSetting(SETTING_KEYS.accountNo),
    accountName: readSetting(SETTING_KEYS.accountName),
  };
  const qrImage = readSetting(SETTING_KEYS.qrImage);
  const hasBankInfo = Boolean(config.bankId && config.accountNo && config.accountName);
  return {
    ...config,
    hasBankInfo,
    hasQrImage: Boolean(qrImage),
    // Đổi khi admin tải ảnh mới, để trình duyệt không dùng ảnh cũ trong cache
    qrImageVersion: qrImage ? crypto.createHash('sha1').update(qrImage).digest('hex').slice(0, 10) : '',
    configured: hasBankInfo || Boolean(qrImage),
  };
}

// GET /api/payment/config - công khai (thông tin này vốn hiển thị trên mã QR)
router.get('/config', (req, res) => {
  res.json(readConfig());
});

// PUT /api/payment/config - chỉ admin (guardWrites đã chặn). Nhập đủ cả 3 trường hoặc để trống cả 3.
router.put('/config', (req, res) => {
  const bankId = String(req.body?.bankId || '').trim();
  const accountNo = String(req.body?.accountNo || '').replace(/\s+/g, '');
  const accountName = String(req.body?.accountName || '').trim().toUpperCase();
  const isClearing = !bankId && !accountNo && !accountName;

  if (!isClearing) {
    if (!BANK_ID_PATTERN.test(bankId)) {
      return res.status(400).json({ success: false, message: 'Mã ngân hàng không hợp lệ (ví dụ: MB, VCB, SHB).' });
    }
    if (!ACCOUNT_NO_PATTERN.test(accountNo)) {
      return res.status(400).json({ success: false, message: 'Số tài khoản phải gồm 6-20 chữ số.' });
    }
    if (!ACCOUNT_NAME_PATTERN.test(accountName)) {
      return res.status(400).json({ success: false, message: 'Tên chủ tài khoản viết HOA không dấu (3-50 ký tự).' });
    }
  }

  const stmt = db.prepare('INSERT OR REPLACE INTO cai_dat_cua_hang (khoa, gia_tri) VALUES (?, ?)');
  stmt.run(SETTING_KEYS.bankId, bankId);
  stmt.run(SETTING_KEYS.accountNo, accountNo);
  stmt.run(SETTING_KEYS.accountName, accountName);
  res.json({ success: true, config: readConfig() });
});

// ---------------------------------------------------------------- ảnh mã QR do admin tải lên

// GET /api/payment/qr-image - công khai, trả đúng ảnh admin đã tải lên
router.get('/qr-image', (req, res) => {
  const match = QR_IMAGE_PATTERN.exec(readSetting(SETTING_KEYS.qrImage));
  if (!match) return res.status(404).json({ message: 'Chưa có ảnh mã QR' });
  res.setHeader('Content-Type', match[1]);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(Buffer.from(match[2], 'base64'));
});

// PUT /api/payment/qr-image - admin tải ảnh lên (data URL PNG/JPEG/WebP)
router.put('/qr-image', (req, res) => {
  const image = String(req.body?.image || '');
  if (image.length > MAX_QR_IMAGE_CHARS) {
    return res.status(413).json({ success: false, message: 'Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 1,5MB.' });
  }
  if (!QR_IMAGE_PATTERN.test(image)) {
    return res.status(400).json({ success: false, message: 'Chỉ nhận ảnh PNG, JPEG hoặc WebP.' });
  }
  db.prepare('INSERT OR REPLACE INTO cai_dat_cua_hang (khoa, gia_tri) VALUES (?, ?)').run(SETTING_KEYS.qrImage, image);
  res.json({ success: true, config: readConfig() });
});

// DELETE /api/payment/qr-image - admin gỡ ảnh, quay lại tự tạo mã QR từ thông tin tài khoản
router.delete('/qr-image', (req, res) => {
  db.prepare('DELETE FROM cai_dat_cua_hang WHERE khoa = ?').run(SETTING_KEYS.qrImage);
  res.json({ success: true, config: readConfig() });
});

// ---------------------------------------------------------------- trạng thái thanh toán

function findOrder(rawId) {
  const cleanId = String(rawId || '').replace(/^#+/, '');
  return db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(cleanId, '#' + cleanId);
}

// GET /api/payment/status/:orderId - công khai, chỉ trả cờ đã thanh toán
router.get('/status/:orderId', (req, res) => {
  const order = findOrder(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  res.json({ orderId: order.ma_don_hang.replace(/^#+/, ''), paid: Boolean(order.da_thanh_toan), status: order.trang_thai });
});

// POST /api/payment/orders/:id/confirm - admin xác nhận đã nhận tiền (sau khi đối chiếu sao kê ngân hàng)
router.post('/orders/:id/confirm', (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
  if (order.trang_thai === 'Đã hủy') {
    return res.status(409).json({ success: false, message: 'Đơn hàng đã hủy, không thể xác nhận thanh toán.' });
  }
  if (order.da_thanh_toan) {
    return res.json({ success: true, message: 'Đơn hàng đã được xác nhận thanh toán trước đó.' });
  }
  const nextStatus = AWAITING_PAYMENT_STATUSES.has(order.trang_thai) ? PAID_STATUS : order.trang_thai;
  db.prepare(`
    UPDATE don_hang
    SET da_thanh_toan = 1, thoi_gian_thanh_toan = ?, ma_giao_dich_ngan_hang = ?, trang_thai = ?
    WHERE ma_don_hang = ?
  `).run(new Date().toISOString(), `ADMIN-${req.admin?.sub || 'admin'}`, nextStatus, order.ma_don_hang);
  res.json({ success: true, message: 'Đã xác nhận thanh toán.' });
});

export default router;
