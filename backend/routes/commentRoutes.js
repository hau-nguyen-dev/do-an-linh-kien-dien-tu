import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// GET /api/comments - Lấy danh sách bình luận (hỗ trợ lọc theo productId hoặc lấy toàn bộ cho Admin)
router.get('/', (req, res) => {
  const { productId, status } = req.query;
  let sql = `
    SELECT c.*, p.ten as product_name, p.hinh_anh as product_img
    FROM binh_luan c
    LEFT JOIN san_pham p ON c.ma_san_pham = p.id
  `;
  const conditions = [];
  const params = [];

  if (productId) {
    conditions.push('c.ma_san_pham = ?');
    params.push(productId);
  }
  if (status) {
    conditions.push('c.trang_thai = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY c.ngay_tao DESC';

  const rows = db.prepare(sql).all(...params);
  res.json(rows.map((r) => ({
    id: r.id,
    productId: r.ma_san_pham,
    maSanPham: r.ma_san_pham,
    productName: r.product_name || r.ma_san_pham,
    tenSanPham: r.product_name || r.ma_san_pham,
    productImg: r.product_img || '',
    hinhAnhSanPham: r.product_img || '',
    author: r.ten_nguoi_gui,
    tenNguoiGui: r.ten_nguoi_gui,
    phone: r.so_dien_thoai,
    soDienThoai: r.so_dien_thoai,
    content: r.noi_dung,
    noiDung: r.noi_dung,
    reply: r.tra_loi_admin,
    traLoiAdmin: r.tra_loi_admin,
    status: r.trang_thai,
    trangThai: r.trang_thai,
    createdAt: r.ngay_tao,
    ngayTao: r.ngay_tao,
  })));
});

// POST /api/comments - Khách hàng gửi bình luận / câu hỏi mới
router.post('/', (req, res) => {
  const { productId, maSanPham, author, tenNguoiGui, phone, soDienThoai, content, noiDung } = req.body;
  const pId = productId || maSanPham;
  if (!pId) {
    return res.status(400).json({ error: 'Thiếu productId' });
  }
  const rawContent = content || noiDung;
  if (!rawContent || !rawContent.trim()) {
    return res.status(400).json({ error: 'Nội dung bình luận không được để trống' });
  }

  const cleanAuthor = (author || tenNguoiGui || 'Khách hàng').trim();
  const cleanPhone = (phone || soDienThoai || '').trim();
  const cleanContent = rawContent.trim();

  const insertSql = `
    INSERT INTO binh_luan (ma_san_pham, ten_nguoi_gui, so_dien_thoai, noi_dung, trang_thai)
    VALUES (?, ?, ?, ?, 'approved')
  `;
  const info = db.prepare(insertSql).run(pId, cleanAuthor, cleanPhone, cleanContent);
  const created = db.prepare('SELECT * FROM binh_luan WHERE id = ?').get(info.lastInsertRowid);

  res.status(201).json({
    id: created.id,
    productId: created.ma_san_pham,
    maSanPham: created.ma_san_pham,
    author: created.ten_nguoi_gui,
    tenNguoiGui: created.ten_nguoi_gui,
    phone: created.so_dien_thoai,
    soDienThoai: created.so_dien_thoai,
    content: created.noi_dung,
    noiDung: created.noi_dung,
    reply: created.tra_loi_admin,
    traLoiAdmin: created.tra_loi_admin,
    status: created.trang_thai,
    trangThai: created.trang_thai,
    createdAt: created.ngay_tao,
    ngayTao: created.ngay_tao,
  });
});

// PUT /api/comments/:id/reply - Admin phản hồi câu hỏi của khách hàng
router.put('/:id/reply', (req, res) => {
  const id = req.params.id;
  const { reply, traLoiAdmin } = req.body;
  const cleanReply = (reply || traLoiAdmin || '').trim();

  db.prepare('UPDATE binh_luan SET tra_loi_admin = ? WHERE id = ?').run(cleanReply, id);
  const updated = db.prepare('SELECT * FROM binh_luan WHERE id = ?').get(id);
  res.json({ success: true, comment: updated });
});

// DELETE /api/comments/:id - Admin xóa bình luận rác/vi phạm
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM binh_luan WHERE id = ?').run(id);
  res.json({ success: true, id: Number(id) });
});

export default router;
