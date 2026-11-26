import { Router } from 'express';
import { db, formatUser } from '../config/db.js';
import {
  checkStoredPassword,
  encodePassword,
  isValidNewPassword,
  issueToken,
  requireCustomer,
} from '../middleware/adminAuth.js';
import { createFailureLimiter } from '../middleware/failureLimiter.js';

const router = Router();

const PHONE_PATTERN = /^\+?\d{9,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_ADDRESS_LENGTH = 300;
const WEAK_PASSWORD_MESSAGE = 'Mật khẩu phải có ít nhất 8 ký tự.';
const LOGIN_FAILED_MESSAGE = 'Số điện thoại hoặc mật khẩu không chính xác.';

// Chống dò mật khẩu: tối đa 5 lần sai / 15 phút, tính theo cả IP lẫn số điện thoại
const loginLimiter = createFailureLimiter({ maxFailures: 5, windowMs: 15 * 60 * 1000 });

const normalizePhone = (value) => String(value || '').replace(/[\s.\-]/g, '');
const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

function sessionResponse(userRow, extra = {}) {
  return { success: true, user: formatUser(userRow), token: issueToken(userRow.so_dien_thoai, 'customer'), ...extra };
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { fullName, name, password, city, tinhThanh, district, quanHuyen, address, diaChi, email } = req.body || {};
    const phone = normalizePhone(req.body?.phone);
    const finalName = clean(fullName || name, MAX_NAME_LENGTH);
    const finalPassword = String(password || '');

    if (!PHONE_PATTERN.test(phone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
    }
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên.' });
    }
    if (!isValidNewPassword(finalPassword)) {
      return res.status(400).json({ success: false, message: WEAK_PASSWORD_MESSAGE });
    }
    const finalEmail = clean(email, 120) || `${phone}@net.vn`;
    if (!EMAIL_PATTERN.test(finalEmail)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
    }

    if (db.prepare('SELECT 1 FROM nguoi_dung WHERE so_dien_thoai = ?').get(phone)) {
      return res.status(409).json({ success: false, message: 'Số điện thoại này đã được đăng ký. Vui lòng chuyển sang Đăng nhập!' });
    }

    const id = 'U' + Date.now();
    db.prepare(`
      INSERT INTO nguoi_dung (id, ho_ten, so_dien_thoai, mat_khau, email, tinh_thanh, quan_huyen, dia_chi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      finalName,
      phone,
      encodePassword(finalPassword),
      finalEmail,
      clean(city || tinhThanh, 60) || 'Hà Nội',
      clean(district || quanHuyen, 60),
      clean(address || diaChi, MAX_ADDRESS_LENGTH)
    );

    const created = db.prepare('SELECT * FROM nguoi_dung WHERE id = ?').get(id);
    res.status(201).json(sessionResponse(created, { message: 'Đăng ký tài khoản thành công!' }));
  } catch (err) {
    console.error('[Auth Register Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng ký.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    const password = String(req.body?.password || '');
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu.' });
    }

    const keys = [`ip:${req.ip}`, `phone:${phone}`];
    if (keys.some((key) => loginLimiter.isLocked(key))) {
      return res.status(429).json({ success: false, message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
    }

    const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(phone);
    const check = user ? checkStoredPassword(password, user.mat_khau) : { ok: false };
    if (!user || !check.ok) {
      keys.forEach((key) => loginLimiter.record(key));
      return res.status(401).json({ success: false, message: LOGIN_FAILED_MESSAGE });
    }

    keys.forEach((key) => loginLimiter.clear(key));
    if (check.legacy) {
      // Nâng cấp mật khẩu cũ (văn bản thô) sang dạng băm ngay khi đăng nhập thành công
      db.prepare('UPDATE nguoi_dung SET mat_khau = ? WHERE id = ?').run(encodePassword(password), user.id);
    }
    res.json(sessionResponse(user, { message: 'Đăng nhập thành công!' }));
  } catch (err) {
    console.error('[Auth Login Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng nhập.' });
  }
});

// PUT /api/auth/profile - chỉ sửa được tài khoản của chính phiên đăng nhập
router.put('/profile', requireCustomer, (req, res) => {
  try {
    const { fullName, name, city, tinhThanh, district, quanHuyen, address, diaChi, email, password, currentPassword } = req.body || {};
    const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(req.customer.sub);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản để cập nhật.' });
    }

    let passwordColumn = user.mat_khau;
    if (password) {
      // Đổi mật khẩu phải xác nhận lại mật khẩu hiện tại
      if (!checkStoredPassword(String(currentPassword || ''), user.mat_khau).ok) {
        return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
      }
      if (!isValidNewPassword(String(password))) {
        return res.status(400).json({ success: false, message: WEAK_PASSWORD_MESSAGE });
      }
      passwordColumn = encodePassword(String(password));
    }

    const finalEmail = clean(email, 120) || user.email || '';
    if (finalEmail && !EMAIL_PATTERN.test(finalEmail)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
    }

    db.prepare(`
      UPDATE nguoi_dung
      SET ho_ten = ?, mat_khau = ?, email = ?, tinh_thanh = ?, quan_huyen = ?, dia_chi = ?
      WHERE id = ?
    `).run(
      clean(fullName || name, MAX_NAME_LENGTH) || user.ho_ten,
      passwordColumn,
      finalEmail,
      clean(city || tinhThanh, 60) || user.tinh_thanh || 'Hà Nội',
      clean(district || quanHuyen, 60) || user.quan_huyen || '',
      clean(address || diaChi, MAX_ADDRESS_LENGTH) || user.dia_chi || '',
      user.id
    );

    const updated = db.prepare('SELECT * FROM nguoi_dung WHERE id = ?').get(user.id);
    res.json({ success: true, user: formatUser(updated), message: 'Cập nhật thông tin tài khoản thành công!' });
  } catch (err) {
    console.error('[Auth Profile Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật tài khoản.' });
  }
});

// GET /api/auth/me - thông tin tài khoản đang đăng nhập (không còn tra theo số điện thoại bất kỳ)
router.get('/me', requireCustomer, (req, res) => {
  const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(req.customer.sub);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }
  res.json(formatUser(user));
});

export default router;
