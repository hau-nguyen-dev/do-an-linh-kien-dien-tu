import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// GET /api/banners
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM banner').all();
  res.json(rows.map((b) => ({
    id: b.id,
    tag: b.the_phu,
    thePhu: b.the_phu,
    title: b.tieu_de,
    tieuDe: b.tieu_de,
    description: b.mo_ta,
    moTa: b.mo_ta,
    buttonText: b.chu_tren_nut,
    chuTrenNut: b.chu_tren_nut,
    buttonLink: b.lien_ket_nut,
    lienKetNut: b.lien_ket_nut,
    priceText: b.chu_gia,
    chuGia: b.chu_gia,
    img: b.hinh_anh,
    hinhAnh: b.hinh_anh,
    isActive: Boolean(b.dang_hien_thi),
    dangHienThi: Boolean(b.dang_hien_thi),
  })));
});

// PUT /api/banners/:id
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const b = req.body;
  const updateSql = `
    UPDATE banner SET
      the_phu = COALESCE(?, the_phu),
      tieu_de = COALESCE(?, tieu_de),
      mo_ta = COALESCE(?, mo_ta),
      chu_tren_nut = COALESCE(?, chu_tren_nut),
      lien_ket_nut = COALESCE(?, lien_ket_nut),
      chu_gia = COALESCE(?, chu_gia),
      hinh_anh = COALESCE(?, hinh_anh),
      dang_hien_thi = COALESCE(?, dang_hien_thi),
      ngay_cap_nhat = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.prepare(updateSql).run(
    b.thePhu ?? b.tag ?? null,
    b.tieuDe ?? b.title ?? null,
    b.moTa ?? b.description ?? null,
    b.chuTrenNut ?? b.buttonText ?? null,
    b.lienKetNut ?? b.buttonLink ?? null,
    b.chuGia ?? b.priceText ?? null,
    b.hinhAnh ?? b.img ?? null,
    b.dangHienThi !== undefined ? (b.dangHienThi ? 1 : 0) : (b.isActive !== undefined ? (b.isActive ? 1 : 0) : null),
    id
  );
  const updated = db.prepare('SELECT * FROM banner WHERE id = ?').get(id);
  res.json({
    id: updated.id,
    tag: updated.the_phu,
    thePhu: updated.the_phu,
    title: updated.tieu_de,
    tieuDe: updated.tieu_de,
    description: updated.mo_ta,
    moTa: updated.mo_ta,
    buttonText: updated.chu_tren_nut,
    chuTrenNut: updated.chu_tren_nut,
    buttonLink: updated.lien_ket_nut,
    lienKetNut: updated.lien_ket_nut,
    priceText: updated.chu_gia,
    chuGia: updated.chu_gia,
    img: updated.hinh_anh,
    hinhAnh: updated.hinh_anh,
    isActive: Boolean(updated.dang_hien_thi),
    dangHienThi: Boolean(updated.dang_hien_thi),
  });
});

export default router;
