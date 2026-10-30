import { Router } from 'express';
import { db, formatUser } from '../config/db.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { fullName, name, phone, password, city, tinhThanh, district, quanHuyen, address, diaChi, email } = req.body;
    const finalPhone = String(phone || '').trim();
    const finalName = String(fullName || name || '').trim();
    const finalPassword = String(password || '').trim();

    if (!finalPhone) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại' });
    }
    if (!finalName) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên' });
    }
    if (!finalPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng tạo mật khẩu cho tài khoản' });
    }

    const existing = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(finalPhone);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Số điện thoại này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập!' });
    }

    const id = 'U' + Date.now();
    const finalCity = city || tinhThanh || 'Hà Nội';
    const finalDistrict = district || quanHuyen || '';
    const finalAddress = address || diaChi || '';
    const finalEmail = email || `${finalPhone}@net.vn`;

    const insertSql = `
      INSERT INTO nguoi_dung (
        id, ho_ten, so_dien_thoai, mat_khau, email, tinh_thanh, quan_huyen, dia_chi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.prepare(insertSql).run(
      id,
      finalName,
      finalPhone,
      finalPassword,
      finalEmail,
      finalCity,
      finalDistrict,
      finalAddress
    );

    const created = db.prepare('SELECT * FROM nguoi_dung WHERE id = ?').get(id);
    res.status(201).json({
      success: true,
      user: formatUser(created),
      message: 'Đăng ký tài khoản thành công!'
    });
  } catch (err) {
    console.error('[Auth Register Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng ký: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { phone, password } = req.body;
    const finalPhone = String(phone || '').trim();
    const finalPassword = String(password || '').trim();

    if (!finalPhone || !finalPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu' });
    }

    const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(finalPhone);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Số điện thoại chưa được đăng ký tài khoản' });
    }

    if (user.mat_khau !== finalPassword) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
    }

    res.json({
      success: true,
      user: formatUser(user),
      message: 'Đăng nhập thành công!'
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng nhập: ' + err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', (req, res) => {
  try {
    const { phone, fullName, name, city, tinhThanh, district, quanHuyen, address, diaChi, email, password } = req.body;
    const finalPhone = String(phone || '').trim();

    if (!finalPhone) {
      return res.status(400).json({ success: false, message: 'Thiếu số điện thoại định danh tài khoản' });
    }

    const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(finalPhone);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản để cập nhật' });
    }

    const finalName = fullName || name || user.ho_ten;
    const finalCity = city || tinhThanh || user.tinh_thanh || 'Hà Nội';
    const finalDistrict = district || quanHuyen || user.quan_huyen || '';
    const finalAddress = address || diaChi || user.dia_chi || '';
    const finalEmail = email || user.email || '';
    const finalPassword = password ? String(password).trim() : user.mat_khau;

    db.prepare(`
      UPDATE nguoi_dung
      SET ho_ten = ?, mat_khau = ?, email = ?, tinh_thanh = ?, quan_huyen = ?, dia_chi = ?
      WHERE so_dien_thoai = ?
    `).run(
      finalName,
      finalPassword,
      finalEmail,
      finalCity,
      finalDistrict,
      finalAddress,
      finalPhone
    );

    const updated = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(finalPhone);
    res.json({
      success: true,
      user: formatUser(updated),
      message: 'Cập nhật thông tin tài khoản & địa chỉ thành công!'
    });
  } catch (err) {
    console.error('[Auth Profile Error]', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật tài khoản: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ message: 'Thiếu tham số phone' });
  }
  const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(phone);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }
  res.json(formatUser(user));
});

export default router;

