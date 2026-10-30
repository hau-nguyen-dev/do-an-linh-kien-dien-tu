import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.sqlite');

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

export function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function formatReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    productId: row.ma_san_pham,
    author: row.tac_gia,
    phone: row.so_dien_thoai || '',
    rating: row.so_sao ?? 5,
    content: row.noi_dung,
    verified: Boolean(row.da_mua_hang ?? 1),
    date: row.ngay_tao,
  };
}

export function formatProduct(row, reviewsList = null) {
  if (!row) return null;
  const albumAnh = safeJsonParse(row.album_anh, []);
  const thongSoKyThuat = safeJsonParse(row.thong_so_ky_thuat, {});
  const nhomPhanLoai = safeJsonParse(row.nhom_phan_loai, []);
  const bienThe = safeJsonParse(row.bien_the, []);
  const danhGia = reviewsList !== null ? reviewsList : safeJsonParse(row.danh_gia, []);

  return {
    id: row.id,
    duongDan: row.duong_dan,
    slug: row.duong_dan,
    ten: row.ten,
    name: row.ten,
    tenDayDu: row.ten_day_du || row.ten,
    fullName: row.ten_day_du || row.ten,
    thuongHieu: row.thuong_hieu,
    brand: row.thuong_hieu,
    tenThuongHieu: row.ten_thuong_hieu || row.thuong_hieu,
    brandLabel: row.ten_thuong_hieu || row.thuong_hieu,
    maDanhMuc: row.ma_danh_muc,
    category: row.ma_danh_muc,
    tenDanhMuc: row.ten_danh_muc || row.ma_danh_muc,
    categoryLabel: row.ten_danh_muc || row.ma_danh_muc,
    giaBan: row.gia_ban,
    price: row.gia_ban,
    giaGoc: row.gia_goc,
    originalPrice: row.gia_goc,
    hasDiscount: Boolean(row.gia_goc && row.gia_goc > row.gia_ban),
    giamTruTrucTiep: row.giam_tru_truc_tiep ?? 0,
    discountAmount: row.giam_tru_truc_tiep ?? 0,
    coTraGop: row.co_tra_gop ?? 1,
    isInstallment: row.co_tra_gop ?? 1,
    hinhAnh: row.hinh_anh,
    img: row.hinh_anh,
    albumAnh,
    gallery: albumAnh,
    diemDanhGia: row.diem_danh_gia ?? 5.0,
    rating: row.diem_danh_gia ?? 5.0,
    soLuotDanhGia: row.so_luot_danh_gia ?? 0,
    reviewCount: row.so_luot_danh_gia ?? 0,
    thongSoNgan: row.thong_so_ngan || '',
    specsShort: row.thong_so_ngan || '',
    thongSoKyThuat,
    specsDetailed: thongSoKyThuat,
    quaTang: row.qua_tang || '',
    gift: row.qua_tang || '',
    huyHieu: row.huy_hieu || '',
    badge: row.huy_hieu || '',
    baiVietMoTa: row.bai_viet_mo_ta || '',
    desc: row.bai_viet_mo_ta || '',
    nhomPhanLoai,
    variantGroups: nhomPhanLoai,
    bienThe,
    variants: bienThe,
    danhGia,
    reviews: danhGia,
    tonKho: row.ton_kho ?? 50,
    stock: row.ton_kho ?? 50,
    trangThai: row.trang_thai || 'active',
    status: row.trang_thai || 'active',
    ngayTao: row.ngay_tao,
    createdAt: row.ngay_tao,
  };
}

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  'Chờ xác nhận': 'Chờ xác nhận',
  pending_qr: 'Chờ thanh toán QR',
  'Chờ thanh toán QR': 'Chờ thanh toán QR',
  'Chờ thanh toán VietQR': 'Chờ thanh toán QR',
  processing: 'Đang xử lý',
  'Đang xử lý': 'Đang xử lý',
  shipping: 'Đang giao hàng',
  'Đang giao hàng': 'Đang giao hàng',
  'Đang giao': 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  'Đã giao': 'Đã giao hàng',
  'Đã giao hàng': 'Đã giao hàng',
  'Đã giao hàng thành công': 'Đã giao hàng',
  cancelled: 'Đã hủy',
  'Đã hủy': 'Đã hủy',
};

const STATUS_CODES = {
  'Chờ xác nhận': 'pending',
  pending: 'pending',
  'Chờ thanh toán QR': 'pending_qr',
  'Chờ thanh toán VietQR': 'pending_qr',
  pending_qr: 'pending_qr',
  'Đang xử lý': 'processing',
  processing: 'processing',
  'Đang giao hàng': 'shipping',
  'Đang giao': 'shipping',
  shipping: 'shipping',
  'Đã giao hàng': 'delivered',
  'Đã giao': 'delivered',
  'Đã giao hàng thành công': 'delivered',
  delivered: 'delivered',
  'Đã hủy': 'cancelled',
  cancelled: 'cancelled',
};

export function formatOrder(row) {
  if (!row) return null;
  const items = safeJsonParse(row.danh_sach_san_pham, []);
  const cleanId = (row.ma_don_hang || '').replace(/^#+/, '');
  const rawStatus = row.trang_thai || 'Chờ xác nhận';
  const statusLabel = STATUS_LABELS[rawStatus] || rawStatus;
  const statusCode = STATUS_CODES[rawStatus] || 'pending';

  const rawMethod = row.phuong_thuc_thanh_toan || '';
  const isVietQR = rawMethod.toLowerCase().includes('vietqr') || rawMethod.toLowerCase().includes('chuyển khoản') || rawMethod.toLowerCase().includes('qr') || rawMethod.toLowerCase().includes('banking');
  const isMoMo = rawMethod.toLowerCase().includes('momo') || rawMethod.toLowerCase().includes('ví');
  const methodCode = isVietQR ? 'vietqr' : (isMoMo ? 'momo' : 'cod');
  const methodLabel = isVietQR ? 'Chuyển khoản VietQR' : (isMoMo ? 'Ví MoMo' : (rawMethod || 'Thanh toán khi nhận hàng (COD)'));

  return {
    id: cleanId,
    orderId: cleanId,
    maDonHang: cleanId,
    tenKhachHang: row.ten_khach_hang,
    customerName: row.ten_khach_hang,
    soDienThoai: row.so_dien_thoai,
    phone: row.so_dien_thoai,
    diaChi: row.dia_chi,
    address: row.dia_chi,
    ghiChu: row.ghi_chu || '',
    note: row.ghi_chu || '',
    customer: {
      fullName: row.ten_khach_hang,
      name: row.ten_khach_hang,
      phone: row.so_dien_thoai,
      address: row.dia_chi,
      note: row.ghi_chu || '',
    },
    phuongThucThanhToan: methodLabel,
    paymentMethod: methodCode,
    paymentMethodLabel: methodLabel,
    danhSachSanPham: items,
    items,
    tamTinh: row.tam_tinh,
    subtotal: row.tam_tinh,
    tienGiam: row.tien_giam || 0,
    discount: row.tien_giam || 0,
    tongTien: row.tong_tien,
    total: row.tong_tien,
    trangThai: statusLabel,
    status: statusLabel,
    statusCode,
    lyDoHuy: row.ly_do_huy,
    cancelReason: row.ly_do_huy,
    ngayTao: row.ngay_tao,
    createdAt: row.ngay_tao,
    maVoucher: row.ma_voucher || '',
    voucherCode: row.ma_voucher || '',
    userId: row.ma_nguoi_dung || '',
    maNguoiDung: row.ma_nguoi_dung || '',
    isVerifiedUser: true,
  };
}

try {
  const donHangCols = db.prepare("PRAGMA table_info(don_hang)").all();
  if (!donHangCols.some((c) => c.name === 'ma_nguoi_dung')) {
    db.exec('ALTER TABLE don_hang ADD COLUMN ma_nguoi_dung TEXT;');
  }
} catch (e) {
  console.warn('[DB Migration Notice]', e.message);
}

db.exec(`
CREATE TABLE IF NOT EXISTS nguoi_dung (
    id TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    so_dien_thoai TEXT UNIQUE NOT NULL,
    mat_khau TEXT NOT NULL,
    email TEXT,
    tinh_thanh TEXT DEFAULT 'Hà Nội',
    quan_huyen TEXT DEFAULT '',
    dia_chi TEXT DEFAULT '',
    hang_thanh_vien TEXT DEFAULT 'Hội viên Nét.',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.ho_ten,
    fullName: row.ho_ten,
    phone: row.so_dien_thoai,
    email: row.email || '',
    city: row.tinh_thanh || 'Hà Nội',
    tinhThanh: row.tinh_thanh || 'Hà Nội',
    district: row.quan_huyen || '',
    quanHuyen: row.quan_huyen || '',
    address: row.dia_chi || '',
    diaChi: row.dia_chi || '',
    tier: row.hang_thanh_vien || 'Hội viên Nét.',
    createdAt: row.ngay_tao,
  };
}
