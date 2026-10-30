import { Router } from 'express';
import { db, safeJsonParse } from '../config/db.js';

const router = Router();

// GET /api/categories
router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT * FROM danh_muc').all();
  res.json(rows.map((r) => ({
    slug: r.ma_danh_muc,
    maDanhMuc: r.ma_danh_muc,
    name: r.ten_danh_muc,
    tenDanhMuc: r.ten_danh_muc,
    count: r.so_luong_san_pham,
    soLuongSanPham: r.so_luong_san_pham,
    icon: r.bieu_tuong,
    bieuTuong: r.bieu_tuong,
    link: r.lien_ket,
    lienKet: r.lien_ket,
  })));
});

// GET /api/vouchers
router.get('/vouchers', (req, res) => {
  const rows = db.prepare('SELECT * FROM ma_giam_gia').all();
  res.json(rows.map((v) => ({
    code: v.ma_voucher,
    maVoucher: v.ma_voucher,
    discountType: v.loai_giam_gia,
    loaiGiamGia: v.loai_giam_gia,
    value: v.gia_tri_giam,
    giaTriGiam: v.gia_tri_giam,
    minOrder: v.don_toi_thieu,
    donToiThieu: v.don_toi_thieu,
    desc: v.mo_ta,
    moTa: v.mo_ta,
  })));
});

// POST /api/vouchers (Tạo/Cập nhật voucher mới vào SQLite)
router.post('/vouchers', (req, res) => {
  const { code, maVoucher, discountType, loaiGiamGia, value, giaTriGiam, discount, minOrder, donToiThieu, minSpend, desc, moTa } = req.body;
  const cleanCode = (code || maVoucher || '').toUpperCase().trim();
  if (!cleanCode) {
    return res.status(400).json({ error: 'Mã voucher không được để trống' });
  }
  const type = discountType || loaiGiamGia || (discount ? 'fixed' : 'percent');
  const val = Number(value ?? giaTriGiam ?? discount ?? 0);
  const minOrd = Number(minOrder ?? donToiThieu ?? minSpend ?? 0);
  const description = desc || moTa || '';

  const insertSql = `
    INSERT OR REPLACE INTO ma_giam_gia (ma_voucher, loai_giam_gia, gia_tri_giam, don_toi_thieu, mo_ta)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.prepare(insertSql).run(cleanCode, type, val, minOrd, description);
  res.status(201).json({
    code: cleanCode,
    maVoucher: cleanCode,
    discountType: type,
    loaiGiamGia: type,
    value: val,
    giaTriGiam: val,
    minOrder: minOrd,
    donToiThieu: minOrd,
    desc: description,
    moTa: description
  });
});

// DELETE /api/vouchers/:code (Xóa voucher khỏi SQLite)
router.delete('/vouchers/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  db.prepare('DELETE FROM ma_giam_gia WHERE UPPER(ma_voucher) = ?').run(code);
  res.json({ success: true, code });
});

// POST /api/vouchers/validate
router.post('/vouchers/validate', (req, res) => {
  const { code, subtotal, shippingFee } = req.body;
  const cleanCode = (code || '').toUpperCase().trim();
  const voucher = db.prepare('SELECT * FROM ma_giam_gia WHERE UPPER(ma_voucher) = ?').get(cleanCode);
  if (!voucher) {
    return res.json({ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
  }
  const minOrder = Number(voucher.don_toi_thieu) || 0;
  const numSubtotal = Number(subtotal) || 0;
  if (numSubtotal < minOrder) {
    return res.json({
      valid: false,
      message: `Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này (cần thêm ${(minOrder - numSubtotal).toLocaleString('vi-VN')}₫)`,
    });
  }
  let discount = 0;
  const val = Number(voucher.gia_tri_giam) || 0;
  if (voucher.loai_giam_gia === 'percent') {
    discount = Math.round((numSubtotal * val) / 100);
  } else if (voucher.loai_giam_gia === 'shipping') {
    const fee = shippingFee !== undefined ? Number(shippingFee) : 30000;
    discount = Math.min(fee, val);
  } else {
    discount = val;
  }
  res.json({
    valid: true,
    code: voucher.ma_voucher,
    maVoucher: voucher.ma_voucher,
    discount,
    voucher: {
      code: voucher.ma_voucher,
      discountType: voucher.loai_giam_gia,
      value: val,
      minOrder,
      desc: voucher.mo_ta
    },
    message: `Đã áp dụng mã ${voucher.ma_voucher}: ${voucher.mo_ta}`,
  });
});

// GET /api/faqs
router.get('/faqs', (req, res) => {
  const rows = db.prepare('SELECT * FROM cau_hoi_thuong_gap ORDER BY thu_tu ASC, id ASC').all();
  res.json(rows.map((f) => ({
    id: f.id,
    q: f.cau_hoi,
    cauHoi: f.cau_hoi,
    a: f.cau_tra_loi,
    cauTraLoi: f.cau_tra_loi,
  })));
});

// GET /api/settings
router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM cai_dat_cua_hang').all();
  const settings = {};
  for (const row of rows) {
    if (row.khoa === 'showrooms' || row.khoa === 'usps') {
      settings[row.khoa] = safeJsonParse(row.gia_tri, []);
    } else {
      settings[row.khoa] = row.gia_tri;
    }
  }
  res.json(settings);
});

// PUT /api/settings
router.put('/settings', (req, res) => {
  const payload = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO cai_dat_cua_hang (khoa, gia_tri) VALUES (?, ?)');
  for (const [k, v] of Object.entries(payload)) {
    const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
    stmt.run(k, valStr);
  }
  res.json({ success: true, message: 'Đã lưu cấu hình cửa hàng thành công!' });
});

export default router;
