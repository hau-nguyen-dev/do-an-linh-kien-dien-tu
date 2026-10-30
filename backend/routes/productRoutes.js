import { Router } from 'express';
import { db, formatProduct, formatReview, safeJsonParse } from '../config/db.js';

export function toVietnameseSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const router = Router();

// GET /api/products/reviews (Lấy toàn bộ đánh giá từ bảng danh_gia độc lập cho Admin)
router.get('/reviews', (req, res) => {
  const rows = db.prepare(`
    SELECT d.id, d.ma_san_pham as productId, s.ten as productName,
           d.tac_gia as author, d.so_dien_thoai as phone, d.so_sao as rating,
           d.noi_dung as content, d.da_mua_hang as verified, d.ngay_tao as date
    FROM danh_gia d
    LEFT JOIN san_pham s ON d.ma_san_pham = s.id
    ORDER BY d.rowid DESC
  `).all();
  res.json(rows.map((r) => ({ ...r, verified: Boolean(r.verified) })));
});

// DELETE /api/products/reviews/:revId (Xóa đánh giá khỏi bảng danh_gia trong SQLite)
router.delete('/reviews/:revId', (req, res) => {
  const revId = req.params.revId;
  const targetRev = db.prepare('SELECT ma_san_pham FROM danh_gia WHERE id = ?').get(revId);
  if (!targetRev) {
    return res.json({ success: true, revId, deleted: false });
  }

  const prodId = targetRev.ma_san_pham;
  db.prepare('DELETE FROM danh_gia WHERE id = ?').run(revId);

  // Tự động tính toán lại điểm trung bình và số lượt đánh giá
  const stats = db.prepare('SELECT COUNT(*) as count, AVG(so_sao) as avgRating FROM danh_gia WHERE ma_san_pham = ?').get(prodId);
  const count = stats.count || 0;
  const avgRating = count > 0 ? Number(stats.avgRating.toFixed(1)) : 5.0;

  db.prepare('UPDATE san_pham SET so_luot_danh_gia = ?, diem_danh_gia = ? WHERE id = ?').run(
    count,
    avgRating,
    prodId
  );

  res.json({ success: true, revId, deleted: true });
});

// GET /api/products/search?q=...
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  const limit = parseInt(req.query.limit || '5', 10);
  const querySql = `
    SELECT * FROM san_pham 
    WHERE LOWER(ten) LIKE ? OR LOWER(thuong_hieu) LIKE ? OR LOWER(thong_so_ngan) LIKE ?
    LIMIT ?
  `;
  const term = `%${q}%`;
  const rows = db.prepare(querySql).all(term, term, term, limit);
  res.json(rows.map((r) => formatProduct(r)));
});

// GET /api/products
router.get('/', (req, res) => {
  const category = req.query.category;
  let rows;
  if (category && category !== 'all') {
    rows = db.prepare('SELECT * FROM san_pham WHERE ma_danh_muc = ? ORDER BY rowid ASC').all(category);
  } else {
    rows = db.prepare('SELECT * FROM san_pham ORDER BY rowid ASC').all();
  }
  res.json(rows.map((r) => formatProduct(r)));
});

// GET /api/products/:id (Lấy chi tiết sản phẩm và nạp danh sách đánh giá từ bảng danh_gia)
router.get('/:id', (req, res) => {
  const idOrSlug = req.params.id;
  const row = db.prepare('SELECT * FROM san_pham WHERE id = ? OR duong_dan = ?').get(idOrSlug, idOrSlug);
  if (!row) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }

  // Nạp đánh giá thực tế từ bảng danh_gia độc lập
  const revRows = db.prepare('SELECT * FROM danh_gia WHERE ma_san_pham = ? ORDER BY rowid DESC').all(row.id);
  const reviews = revRows.map(formatReview);

  res.json(formatProduct(row, reviews));
});

// POST /api/products/:id/reviews (Khách hàng gửi nhận xét mới vào bảng danh_gia trong SQLite)
router.post('/:id/reviews', (req, res) => {
  const idOrSlug = req.params.id;
  const row = db.prepare('SELECT id FROM san_pham WHERE id = ? OR duong_dan = ?').get(idOrSlug, idOrSlug);
  if (!row) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }

  const rev = req.body;
  const newId = rev.id || 'rev_' + Date.now();
  const author = (rev.author || 'Khách hàng').trim();
  const phone = (rev.phone || '').trim();
  const rating = Number(rev.rating) || 5;
  const content = (rev.content || '').trim();
  const verified = rev.verified !== undefined ? (rev.verified ? 1 : 0) : 1;
  const date = rev.date || new Date().toLocaleDateString('vi-VN');

  db.prepare(`
    INSERT INTO danh_gia (id, ma_san_pham, tac_gia, so_dien_thoai, so_sao, noi_dung, da_mua_hang, ngay_tao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(newId, row.id, author, phone, rating, content, verified, date);

  // Cập nhật lại số liệu thống kê tổng hợp trên san_pham
  const stats = db.prepare('SELECT COUNT(*) as count, AVG(so_sao) as avgRating FROM danh_gia WHERE ma_san_pham = ?').get(row.id);
  const count = stats.count || 0;
  const avgRating = count > 0 ? Number(stats.avgRating.toFixed(1)) : 5.0;

  db.prepare('UPDATE san_pham SET so_luot_danh_gia = ?, diem_danh_gia = ? WHERE id = ?').run(
    count,
    avgRating,
    row.id
  );

  const newRevObj = {
    id: newId,
    productId: row.id,
    author,
    phone,
    rating,
    content,
    verified: Boolean(verified),
    date,
  };

  res.status(201).json({ success: true, review: newRevObj, reviewCount: count, rating: avgRating });
});

// POST /api/products (Thêm sản phẩm mới cho Admin)
router.post('/', (req, res) => {
  const p = req.body;
  const id = p.id || 'p_' + Date.now();
  const slug = p.duongDan || p.slug || toVietnameseSlug(p.ten || p.name || '');
  const ten = p.ten || p.name || '';
  const tenDayDu = p.tenDayDu || p.fullName || ten;
  const thuongHieu = p.thuongHieu || p.brand || 'other';
  const tenThuongHieu = p.tenThuongHieu || p.brandLabel || thuongHieu;
  const maDanhMuc = p.maDanhMuc || p.category || 'accessories';
  const tenDanhMuc = p.tenDanhMuc || p.categoryLabel || maDanhMuc;
  const giaBan = p.price !== undefined ? Number(p.price) : (p.giaBan !== undefined ? Number(p.giaBan) : 0);
  const giaGoc = p.giaGoc !== undefined ? Number(p.giaGoc) : (p.originalPrice ? Number(p.originalPrice) : null);
  const giamTruTrucTiep = p.giamTruTrucTiep !== undefined
    ? Number(p.giamTruTrucTiep)
    : (p.discountAmount !== undefined ? Number(p.discountAmount) : (giaGoc && giaGoc > giaBan ? giaGoc - giaBan : 0));
  const coTraGop = p.isInstallment !== undefined ? (p.isInstallment ? 1 : 0) : (p.coTraGop !== undefined ? (p.coTraGop ? 1 : 0) : 1);
  const hinhAnh = p.img || p.hinhAnh || '';
  const albumAnh = p.gallery || p.albumAnh || [];
  const thongSoNgan = p.specsShort !== undefined ? p.specsShort : (p.thongSoNgan || '');
  const thongSoKyThuat = p.specsDetailed || p.thongSoKyThuat || {};
  const quaTang = p.gift !== undefined ? p.gift : (p.quaTang || '');
  const huyHieu = p.badge !== undefined ? p.badge : (p.huyHieu || '');
  const baiVietMoTa = p.desc || p.baiVietMoTa || '';
  const nhomPhanLoai = p.variantGroups || p.nhomPhanLoai || [];
  const bienThe = p.variants || p.bienThe || [];
  const danhGia = p.danhGia || [];
  const tonKho = p.stock !== undefined ? Number(p.stock) : (p.tonKho !== undefined ? Number(p.tonKho) : 50);
  const trangThai = p.status || p.trangThai || 'active';

  const insertSql = `
    INSERT INTO san_pham (
      id, duong_dan, ten, ten_day_du, thuong_hieu, ten_thuong_hieu, ma_danh_muc, ten_danh_muc,
      gia_ban, gia_goc, giam_tru_truc_tiep, co_tra_gop, hinh_anh, album_anh, diem_danh_gia, so_luot_danh_gia,
      thong_so_ngan, thong_so_ky_thuat, qua_tang, huy_hieu, bai_viet_mo_ta, nhom_phan_loai, bien_the, danh_gia, ton_kho, trang_thai
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(insertSql).run(
    id,
    slug,
    ten,
    tenDayDu,
    thuongHieu,
    tenThuongHieu,
    maDanhMuc,
    tenDanhMuc,
    giaBan,
    giaGoc,
    giamTruTrucTiep,
    coTraGop,
    hinhAnh,
    JSON.stringify(albumAnh),
    p.diemDanhGia || p.rating || 5.0,
    p.soLuotDanhGia || p.reviewCount || 0,
    thongSoNgan,
    JSON.stringify(thongSoKyThuat),
    quaTang,
    huyHieu,
    baiVietMoTa,
    JSON.stringify(nhomPhanLoai),
    JSON.stringify(bienThe),
    JSON.stringify(danhGia),
    tonKho,
    trangThai
  );

  const created = db.prepare('SELECT * FROM san_pham WHERE id = ?').get(id);
  res.status(201).json(formatProduct(created));
});

// PUT /api/products/:id (Cập nhật sản phẩm bao gồm biến thể và thông số)
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const p = req.body;

  const current = db.prepare('SELECT * FROM san_pham WHERE id = ?').get(id);
  if (!current) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }

  const BRAND_LABELS = {
    apple: 'Apple',
    samsung: 'Samsung',
    xiaomi: 'Xiaomi',
    oppo: 'OPPO',
    sony: 'Sony',
    marshall: 'Marshall',
    anker: 'Anker',
    other: 'Khác',
  };
  const CAT_LABELS = {
    phones: 'Điện thoại',
    laptops: 'Laptop',
    tablets: 'Máy tính bảng',
    audio: 'Âm thanh',
    watches: 'Đồng hồ',
    accessories: 'Phụ kiện',
  };

  const duongDan = p.duongDan ?? p.slug ?? current.duong_dan;
  const ten = p.ten ?? p.name ?? current.ten;
  const tenDayDu = p.tenDayDu ?? p.fullName ?? current.ten_day_du;
  const thuongHieu = p.thuongHieu ?? p.brand ?? current.thuong_hieu;
  const tenThuongHieu = p.tenThuongHieu ?? p.brandLabel ?? (p.brand ? (BRAND_LABELS[p.brand] || (p.brand.charAt(0).toUpperCase() + p.brand.slice(1))) : current.ten_thuong_hieu);
  const maDanhMuc = p.maDanhMuc ?? p.category ?? current.ma_danh_muc;
  const tenDanhMuc = p.tenDanhMuc ?? p.categoryLabel ?? (p.category ? (CAT_LABELS[p.category] || p.category) : current.ten_danh_muc);
  // Ưu tiên p.price mới từ form submit nếu có, sau đó mới đến p.giaBan
  const giaBan = p.price !== undefined ? Number(p.price) : (p.giaBan !== undefined ? Number(p.giaBan) : current.gia_ban);

  // Xử lý giá gốc & giảm giá (Hỗ trợ Bật/Tắt và Bật lại giảm giá 100% chuẩn xác)
  let giaGoc = null;
  let giamTruTrucTiep = 0;

  if (p.hasDiscount === true) {
    if (p.originalPrice !== undefined && p.originalPrice !== null && Number(p.originalPrice) > 0) {
      giaGoc = Number(p.originalPrice);
    } else if (p.giaGoc !== undefined && p.giaGoc !== null && Number(p.giaGoc) > 0) {
      giaGoc = Number(p.giaGoc);
    } else {
      giaGoc = current.gia_goc;
    }

    if (giaGoc && giaGoc > giaBan) {
      giamTruTrucTiep = giaGoc - giaBan;
    } else if (p.discountAmount !== undefined && p.discountAmount !== null) {
      giamTruTrucTiep = Number(p.discountAmount);
    } else if (p.giamTruTrucTiep !== undefined && p.giamTruTrucTiep !== null) {
      giamTruTrucTiep = Number(p.giamTruTrucTiep);
    }
  } else if (p.hasDiscount === false || p.originalPrice === null || p.originalPrice === 0) {
    giaGoc = null;
    giamTruTrucTiep = 0;
  } else {
    giaGoc = current.gia_goc;
    giamTruTrucTiep = current.giam_tru_truc_tiep;
  }

  const coTraGop = p.isInstallment !== undefined ? (p.isInstallment ? 1 : 0) : (p.coTraGop !== undefined ? (p.coTraGop ? 1 : 0) : current.co_tra_gop);
  const hinhAnh = p.img ?? p.hinhAnh ?? current.hinh_anh;
  const baiVietMoTa = p.desc ?? p.baiVietMoTa ?? current.bai_viet_mo_ta;
  const tonKho = p.stock !== undefined ? Number(p.stock) : (p.tonKho !== undefined ? Number(p.tonKho) : current.ton_kho);
  const albumAnh = (p.gallery !== undefined) ? JSON.stringify(p.gallery) : ((p.albumAnh !== undefined) ? JSON.stringify(p.albumAnh) : current.album_anh);
  const nhomPhanLoai = (p.variantGroups !== undefined) ? JSON.stringify(p.variantGroups) : ((p.nhomPhanLoai !== undefined) ? JSON.stringify(p.nhomPhanLoai) : current.nhom_phan_loai);
  const bienThe = (p.variants !== undefined) ? JSON.stringify(p.variants) : ((p.bienThe !== undefined) ? JSON.stringify(p.bienThe) : current.bien_the);
  const thongSoKyThuat = (p.specsDetailed !== undefined) ? JSON.stringify(p.specsDetailed) : ((p.thongSoKyThuat !== undefined) ? JSON.stringify(p.thongSoKyThuat) : current.thong_so_ky_thuat);
  const thongSoNgan = p.specsShort !== undefined ? p.specsShort : (p.thongSoNgan !== undefined ? p.thongSoNgan : current.thong_so_ngan);
  const quaTang = p.gift !== undefined ? p.gift : (p.quaTang !== undefined ? p.quaTang : current.qua_tang);
  const huyHieu = p.badge !== undefined ? p.badge : (p.huyHieu !== undefined ? p.huyHieu : current.huy_hieu);
  const trangThai = p.status ?? p.trangThai ?? current.trang_thai;

  const updateSql = `
    UPDATE san_pham SET
      duong_dan = ?,
      ten = ?,
      ten_day_du = ?,
      thuong_hieu = ?,
      ten_thuong_hieu = ?,
      ma_danh_muc = ?,
      ten_danh_muc = ?,
      gia_ban = ?,
      gia_goc = ?,
      giam_tru_truc_tiep = ?,
      co_tra_gop = ?,
      hinh_anh = ?,
      bai_viet_mo_ta = ?,
      ton_kho = ?,
      album_anh = ?,
      nhom_phan_loai = ?,
      bien_the = ?,
      thong_so_ky_thuat = ?,
      thong_so_ngan = ?,
      qua_tang = ?,
      huy_hieu = ?,
      trang_thai = ?
    WHERE id = ?
  `;

  db.prepare(updateSql).run(
    duongDan,
    ten,
    tenDayDu,
    thuongHieu,
    tenThuongHieu,
    maDanhMuc,
    tenDanhMuc,
    giaBan,
    giaGoc,
    giamTruTrucTiep,
    coTraGop,
    hinhAnh,
    baiVietMoTa,
    tonKho,
    albumAnh,
    nhomPhanLoai,
    bienThe,
    thongSoKyThuat,
    thongSoNgan,
    quaTang,
    huyHieu,
    trangThai,
    id
  );

  const updated = db.prepare('SELECT * FROM san_pham WHERE id = ?').get(id);
  res.json(formatProduct(updated));
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM san_pham WHERE id = ?').run(id);
  res.json({ success: true, id });
});

export default router;
