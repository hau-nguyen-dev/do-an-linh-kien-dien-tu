import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// GET /api/articles
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM bai_viet ORDER BY id DESC').all();
  res.json(rows.map((a) => ({
    id: a.id,
    title: a.tieu_de,
    tieuDe: a.tieu_de,
    category: a.chuyen_muc,
    chuyenMuc: a.chuyen_muc,
    time: a.thoi_gian_doc,
    thoiGianDoc: a.thoi_gian_doc,
    author: a.tac_gia,
    tacGia: a.tac_gia,
    date: a.ngay_dang,
    ngayDang: a.ngay_dang,
    img: a.hinh_anh,
    hinhAnh: a.hinh_anh,
    excerpt: a.tom_tat,
    tomTat: a.tom_tat,
    content: a.noi_dung,
    noiDung: a.noi_dung,
    isPublished: Boolean(a.cong_khai),
    congKhai: Boolean(a.cong_khai),
  })));
});

// POST /api/articles
router.post('/', (req, res) => {
  const a = req.body;
  const insertSql = `
    INSERT INTO bai_viet (tieu_de, chuyen_muc, thoi_gian_doc, tac_gia, ngay_dang, hinh_anh, tom_tat, noi_dung, cong_khai)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;
  const info = db.prepare(insertSql).run(
    a.tieuDe || a.title || 'Bài viết chưa đặt tên',
    a.chuyenMuc || a.category || 'MẸO CÔNG NGHỆ',
    a.thoiGianDoc || a.time || '5 phút đọc',
    a.tacGia || a.author || 'Ban biên tập nét.',
    a.ngayDang || a.date || new Date().toLocaleDateString('vi-VN'),
    a.hinhAnh || a.img || 'src/assets/img/article-1.png',
    a.tomTat || a.excerpt || '',
    a.noiDung || a.content || ''
  );
  const created = db.prepare('SELECT * FROM bai_viet WHERE rowid = ?').get(info.lastInsertRowid);
  res.status(201).json({
    id: created.id,
    title: created.tieu_de,
    tieuDe: created.tieu_de,
    category: created.chuyen_muc,
    chuyenMuc: created.chuyen_muc,
    time: created.thoi_gian_doc,
    thoiGianDoc: created.thoi_gian_doc,
    author: created.tac_gia,
    tacGia: created.tac_gia,
    date: created.ngay_dang,
    ngayDang: created.ngay_dang,
    img: created.hinh_anh,
    hinhAnh: created.hinh_anh,
    excerpt: created.tom_tat,
    tomTat: created.tom_tat,
    content: created.noi_dung,
    noiDung: created.noi_dung,
    isPublished: Boolean(created.cong_khai),
    congKhai: Boolean(created.cong_khai),
  });
});

// PUT /api/articles/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const a = req.body;
  const updateSql = `
    UPDATE bai_viet SET
      tieu_de = COALESCE(?, tieu_de),
      chuyen_muc = COALESCE(?, chuyen_muc),
      thoi_gian_doc = COALESCE(?, thoi_gian_doc),
      tac_gia = COALESCE(?, tac_gia),
      hinh_anh = COALESCE(?, hinh_anh),
      tom_tat = COALESCE(?, tom_tat),
      noi_dung = COALESCE(?, noi_dung)
    WHERE id = ?
  `;
  db.prepare(updateSql).run(
    a.tieuDe ?? a.title ?? null,
    a.chuyenMuc ?? a.category ?? null,
    a.thoiGianDoc ?? a.time ?? null,
    a.tacGia ?? a.author ?? null,
    a.hinhAnh ?? a.img ?? null,
    a.tomTat ?? a.excerpt ?? null,
    a.noiDung ?? a.content ?? null,
    id
  );
  const updated = db.prepare('SELECT * FROM bai_viet WHERE id = ?').get(id);
  res.json({
    id: updated.id,
    title: updated.tieu_de,
    tieuDe: updated.tieu_de,
    category: updated.chuyen_muc,
    chuyenMuc: updated.chuyen_muc,
    time: updated.thoi_gian_doc,
    thoiGianDoc: updated.thoi_gian_doc,
    author: updated.tac_gia,
    tacGia: updated.tac_gia,
    date: updated.ngay_dang,
    ngayDang: updated.ngay_dang,
    img: updated.hinh_anh,
    hinhAnh: updated.hinh_anh,
    excerpt: updated.tom_tat,
    tomTat: updated.tom_tat,
    content: updated.noi_dung,
    noiDung: updated.noi_dung,
    isPublished: Boolean(updated.cong_khai),
    congKhai: Boolean(updated.cong_khai),
  });
});

// DELETE /api/articles/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM bai_viet WHERE id = ?').run(id);
  res.json({ success: true, id });
});

export default router;
