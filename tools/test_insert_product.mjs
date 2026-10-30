import { db, formatProduct } from '../backend/config/db.js';

const testProd = {
  id: "p_test_" + Date.now(),
  name: "Tai nghe Test Pro",
  fullName: "Tai nghe Test Pro Chính Hãng",
  brand: "sony",
  category: "audio",
  price: 1500000,
  originalPrice: 2000000,
  img: "src/assets/img/banner-accessories.png",
  stock: 20,
};

const id = testProd.id;
const slug = (testProd.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const ten = testProd.name;
const tenDayDu = testProd.fullName || ten;
const thuongHieu = testProd.brand || 'other';
const tenThuongHieu = testProd.brand;
const maDanhMuc = testProd.category || 'accessories';
const tenDanhMuc = testProd.category;
const giaBan = testProd.price;
const giaGoc = testProd.originalPrice;
const giamTruTrucTiep = 500000;
const coTraGop = 1;
const hinhAnh = testProd.img;
const albumAnh = [testProd.img];
const thongSoNgan = 'Test specs';
const thongSoKyThuat = {};
const quaTang = '';
const huyHieu = 'HOT';
const baiVietMoTa = '<p>Test description</p>';
const nhomPhanLoai = [];
const bienThe = [];
const danhGia = [];
const tonKho = 20;

try {
  const insertSql = `
    INSERT INTO san_pham (
      id, duong_dan, ten, ten_day_du, thuong_hieu, ten_thuong_hieu, ma_danh_muc, ten_danh_muc,
      gia_ban, gia_goc, giam_tru_truc_tiep, co_tra_gop, hinh_anh, album_anh, diem_danh_gia, so_luot_danh_gia,
      thong_so_ngan, thong_so_ky_thuat, qua_tang, huy_hieu, bai_viet_mo_ta, nhom_phan_loai, bien_the, danh_gia, ton_kho
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(insertSql).run(
    id, slug, ten, tenDayDu, thuongHieu, tenThuongHieu, maDanhMuc, tenDanhMuc,
    giaBan, giaGoc, giamTruTrucTiep, coTraGop, hinhAnh, JSON.stringify(albumAnh),
    5.0, 0, thongSoNgan, JSON.stringify(thongSoKyThuat), quaTang, huyHieu,
    baiVietMoTa, JSON.stringify(nhomPhanLoai), JSON.stringify(bienThe), JSON.stringify(danhGia), tonKho
  );

  console.log("INSERT SUCCESS! ID:", id);
  // clean up
  db.prepare("DELETE FROM san_pham WHERE id = ?").run(id);
  console.log("CLEANUP SUCCESS!");
} catch (e) {
  console.error("INSERT ERROR:", e);
}

