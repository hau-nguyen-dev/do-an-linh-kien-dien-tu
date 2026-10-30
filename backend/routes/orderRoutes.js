import { Router } from 'express';
import { db, formatOrder } from '../config/db.js';

const router = Router();

// GET /api/orders
router.get('/', (req, res) => {
  const { phone, customerPhone } = req.query;
  const targetPhone = phone || customerPhone;

  let rows;
  if (targetPhone) {
    rows = db.prepare('SELECT * FROM don_hang WHERE so_dien_thoai = ? ORDER BY ngay_tao DESC').all(targetPhone);
  } else {
    rows = db.prepare('SELECT * FROM don_hang ORDER BY ngay_tao DESC').all();
  }
  res.json(rows.map(formatOrder));
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const rawId = req.params.id;
  const cleanId = rawId.replace(/^#/, '');
  const row = db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(cleanId, '#' + cleanId);
  if (!row) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
  res.json(formatOrder(row));
});

// POST /api/orders
router.post('/', (req, res) => {
  const ord = req.body;
  const targetPhone = String(ord.phone || ord.soDienThoai || '').trim();

  // 1. CHẶN KHÁCH VÃNG LAI & ĐƠN RÁC: Bắt buộc phải có số điện thoại
  if (!targetPhone) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập hoặc tạo tài khoản để đặt hàng. Đơn hàng từ khách chưa đăng ký bị chặn để tránh đơn rác/spam.'
    });
  }

  // 2. XÁC MINH TÀI KHOẢN: Phải tồn tại trong cơ sở dữ liệu nguoi_dung
  const user = db.prepare('SELECT * FROM nguoi_dung WHERE so_dien_thoai = ?').get(targetPhone);
  if (!user) {
    return res.status(403).json({
      success: false,
      message: 'Số điện thoại này chưa được đăng ký tài khoản. Vui lòng đăng ký tài khoản thành viên để đặt hàng.'
    });
  }

  // 3. CHỐNG SPAWNER/BOT TOOL: Không cho phép tạo đơn liên tục trong 15 giây
  try {
    const recent = db.prepare(`
      SELECT COUNT(*) as count FROM don_hang 
      WHERE so_dien_thoai = ? AND datetime(ngay_tao) >= datetime('now', '-15 seconds')
    `).get(targetPhone);
    if (recent && recent.count > 0) {
      return res.status(429).json({
        success: false,
        message: 'Bạn vừa tạo đơn hàng cách đây ít giây. Vui lòng chờ 15 giây trước khi đặt đơn tiếp theo.'
      });
    }
  } catch (rateErr) {
    // Không chặn nếu sqlite datetime syntax gặp lỗi múi giờ cục bộ
  }

  let id = ord.orderId || ord.maDonHang || ('NET' + Math.floor(10000 + Math.random() * 90000));
  id = id.replace(/^#/, '');

  const methodMap = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    vietqr: 'Chuyển khoản VietQR',
    banking: 'Chuyển khoản VietQR',
    momo: 'Ví MoMo',
  };
  const paymentMethod = methodMap[ord.paymentMethod] || methodMap[ord.phuongThucThanhToan] || ord.paymentMethod || ord.phuongThucThanhToan || 'Thanh toán khi nhận hàng (COD)';
  const status = ord.paymentMethod === 'vietqr' ? 'Chờ thanh toán VietQR' : (ord.status || ord.trangThai || 'Chờ xác nhận');

  const voucherCode = (ord.voucherCode || ord.maVoucher || '').toUpperCase().trim();
  const customerName = user.ho_ten || ord.customerName || ord.tenKhachHang || 'Hội viên Nét.';

  const insertSql = `
    INSERT INTO don_hang (
      ma_don_hang, ten_khach_hang, so_dien_thoai, dia_chi, ghi_chu, phuong_thuc_thanh_toan,
      danh_sach_san_pham, tam_tinh, tien_giam, tong_tien, trang_thai, ma_voucher, ma_nguoi_dung
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(insertSql).run(
    id,
    customerName,
    targetPhone,
    ord.address || ord.diaChi || user.dia_chi || '',
    ord.note || ord.ghiChu || '',
    paymentMethod,
    JSON.stringify(ord.items || ord.danhSachSanPham || []),
    ord.subtotal || ord.tamTinh || ord.total || 0,
    ord.discount || ord.tienGiam || 0,
    ord.total || ord.tongTien || 0,
    status,
    voucherCode,
    user.id
  );

  const created = db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ?').get(id);
  res.status(201).json(formatOrder(created));
});

// PUT /api/orders/:id/status
router.put('/:id/status', (req, res) => {
  const rawId = req.params.id;
  const cleanId = rawId.replace(/^#+/, '');
  const status = req.body.status || req.body.trangThai;

  db.prepare('UPDATE don_hang SET trang_thai = ? WHERE ma_don_hang = ? OR ma_don_hang = ?').run(status, cleanId, '#' + cleanId);
  const updated = db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(cleanId, '#' + cleanId);
  if (!updated) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật' });
  }
  res.json(formatOrder(updated));
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const rawId = req.params.id;
  const cleanId = rawId.replace(/^#+/, '');
  db.prepare('DELETE FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').run(cleanId, '#' + cleanId);
  res.json({ success: true, id: cleanId });
});

export default router;
