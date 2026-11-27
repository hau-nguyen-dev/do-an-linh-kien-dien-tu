import crypto from 'node:crypto';
import { Router } from 'express';
import { db, formatOrder, safeJsonParse } from '../config/db.js';
import { getAdminSession, getCustomerSession } from '../middleware/adminAuth.js';
import {
  cancelPaymentLink, createPaymentLink, getPublicBaseUrl, isPayosConfigured, payosOrderCodeOf,
} from '../services/payos.js';

const router = Router();

const PAYOS_DESCRIPTION_PREFIX = 'N'; // nội dung chuyển khoản tối đa 9 ký tự: "N" + 8 chữ số của mã đơn
const MAX_BUYER_NAME_LENGTH = 100;
const CANCEL_REASON = 'Đơn hàng đã bị hủy';

// Tạo link thanh toán payOS cho đơn VietQR. Lỗi payOS không làm mất đơn: đơn quay về luồng QR thủ công.
async function attachPayosPayment(req, orderId, { total, customerName, phone }) {
  if (!isPayosConfigured()) return;
  const base = getPublicBaseUrl(req);
  if (!base) {
    console.error('[payOS] Thiếu PUBLIC_BASE_URL nên không tạo link thanh toán; đơn dùng QR thủ công.');
    return;
  }
  const orderCode = payosOrderCodeOf(orderId);
  try {
    const link = await createPaymentLink({
      orderCode,
      amount: total,
      description: `${PAYOS_DESCRIPTION_PREFIX}${orderCode}`,
      returnUrl: `${base}/index.html`,
      cancelUrl: `${base}/index.html`,
      buyerName: String(customerName || '').slice(0, MAX_BUYER_NAME_LENGTH),
      buyerPhone: phone,
    });
    db.prepare('UPDATE don_hang SET payos_thong_tin = ? WHERE ma_don_hang = ?').run(JSON.stringify(link), orderId);
  } catch (err) {
    console.error(`[payOS] Không tạo được link thanh toán cho đơn ${orderId}:`, err.message);
  }
}

// Hủy link payOS của đơn chưa thanh toán để khách không chuyển tiền vào đơn đã hủy/xóa (lỗi chỉ ghi log)
function cancelPayosLinkOf(row) {
  if (!row?.payos_thong_tin || row.da_thanh_toan || !isPayosConfigured()) return;
  cancelPaymentLink(payosOrderCodeOf(row.ma_don_hang), CANCEL_REASON).catch((err) => {
    console.error(`[payOS] Không hủy được link thanh toán của đơn ${row.ma_don_hang}:`, err.message);
  });
}

const ORDER_ID_PREFIX = 'NET';
const ORDER_ID_DIGITS = 8;
const MAX_ID_ATTEMPTS = 20;
const MAX_SHIPPING_FEE = 100000;
const MAX_ITEM_QUANTITY = 100;
const AWAITING_QR_STATUS = 'Chờ thanh toán VietQR';
const DEFAULT_STATUS = 'Chờ xác nhận';

// Mã đơn do server cấp: tiền tố + chữ số ngẫu nhiên an toàn, đảm bảo không trùng.
function generateUniqueOrderId() {
  for (let i = 0; i < MAX_ID_ATTEMPTS; i += 1) {
    const candidate = ORDER_ID_PREFIX + crypto.randomInt(10 ** (ORDER_ID_DIGITS - 1), 10 ** ORDER_ID_DIGITS);
    const taken = db.prepare('SELECT 1 FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(candidate, '#' + candidate);
    if (!taken) return candidate;
  }
  throw new Error('Không tạo được mã đơn hàng duy nhất');
}

// GET /api/orders - khách tra theo số điện thoại; xem toàn bộ đơn cần đăng nhập admin
router.get('/', (req, res) => {
  const { phone, customerPhone } = req.query;
  const targetPhone = phone || customerPhone;

  const isAdmin = Boolean(getAdminSession(req));
  if (!targetPhone && !isAdmin) {
    return res.json([]);
  }
  // Khách chỉ xem được đơn của chính số điện thoại đã đăng nhập
  if (targetPhone && !isAdmin && getCustomerSession(req)?.sub !== String(targetPhone)) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để xem đơn hàng.' });
  }

  let rows;
  if (targetPhone) {
    rows = db.prepare('SELECT * FROM don_hang WHERE so_dien_thoai = ? ORDER BY ngay_tao DESC').all(targetPhone);
  } else {
    rows = db.prepare('SELECT * FROM don_hang ORDER BY ngay_tao DESC').all();
  }
  res.json(rows.map(formatOrder));
});

// Giá thấp nhất hợp lệ của một sản phẩm (giá gốc, giá biến thể, chênh lệch âm của nhóm phân loại)
function lowestValidUnitPrice(product) {
  const prices = [Number(product.gia_ban)];
  for (const variant of safeJsonParse(product.bien_the, [])) {
    if (Number.isFinite(Number(variant?.price))) prices.push(Number(variant.price));
  }
  let negativeDiff = 0;
  for (const group of safeJsonParse(product.nhom_phan_loai, [])) {
    const diffs = (group?.options || []).map((o) => Number(o?.priceDiff) || 0);
    negativeDiff += Math.min(0, ...diffs);
  }
  return Math.min(...prices.filter(Number.isFinite)) + negativeDiff;
}

// Tính lại tạm tính từ giá trong CSDL; trả về { error } nếu giỏ hàng không hợp lệ
function priceItemsFromDb(items) {
  if (!Array.isArray(items) || items.length === 0) return { error: 'Giỏ hàng trống hoặc không hợp lệ.' };
  let subtotal = 0;
  for (const item of items) {
    const quantity = Number(item?.quantity ?? item?.qty);
    const unitPrice = Number(item?.price);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY || !Number.isFinite(unitPrice)) {
      return { error: 'Số lượng hoặc đơn giá sản phẩm không hợp lệ.' };
    }
    const product = db.prepare('SELECT gia_ban, bien_the, nhom_phan_loai FROM san_pham WHERE id = ?').get(String(item.id));
    if (!product) return { error: `Sản phẩm "${item?.name || item?.id}" không còn tồn tại.` };
    if (unitPrice < lowestValidUnitPrice(product)) {
      return { error: `Đơn giá của "${item?.name || item?.id}" không khớp bảng giá. Vui lòng tải lại trang.` };
    }
    subtotal += unitPrice * quantity;
  }
  return { subtotal };
}

// Mức giảm tối đa của voucher lên tiền hàng (voucher freeship chỉ giảm phí vận chuyển)
function maxProductDiscount(code, subtotal) {
  if (!code) return 0;
  const voucher = db.prepare('SELECT * FROM ma_giam_gia WHERE UPPER(ma_voucher) = ?').get(code);
  if (!voucher || subtotal < (Number(voucher.don_toi_thieu) || 0)) return 0;
  const value = Number(voucher.gia_tri_giam) || 0;
  if (voucher.loai_giam_gia === 'percent') return Math.round((subtotal * value) / 100);
  if (voucher.loai_giam_gia === 'shipping') return 0;
  return value;
}

// GET /api/orders/:id - admin, hoặc khách đã đăng nhập và là chủ đơn
router.get('/:id', (req, res) => {
  const rawId = req.params.id;
  const cleanId = rawId.replace(/^#/, '');
  const row = db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(cleanId, '#' + cleanId);
  const isOwner = row && getCustomerSession(req)?.sub === row.so_dien_thoai;
  if (!row || (!isOwner && !getAdminSession(req))) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
  res.json(formatOrder(row));
});

// POST /api/orders
router.post('/', async (req, res) => {
  const ord = req.body;

  // 1. CHẶN KHÁCH VÃNG LAI & ĐƠN RÁC: phải đăng nhập, và đơn luôn gắn với số điện thoại của phiên đăng nhập
  const session = getCustomerSession(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập hoặc tạo tài khoản để đặt hàng. Đơn hàng từ khách chưa đăng ký bị chặn để tránh đơn rác/spam.'
    });
  }
  const targetPhone = session.sub;

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

  const voucherCode = String(ord.voucherCode || ord.maVoucher || '').toUpperCase().trim();
  const priced = priceItemsFromDb(ord.items || ord.danhSachSanPham);
  if (priced.error) {
    return res.status(400).json({ success: false, message: priced.error });
  }
  const { subtotal } = priced;
  const productDiscount = maxProductDiscount(voucherCode, subtotal);
  const clientTotal = Number(ord.total ?? ord.tongTien);
  const lowestTotal = Math.max(0, subtotal - productDiscount);
  if (!Number.isFinite(clientTotal) || clientTotal < lowestTotal || clientTotal > subtotal + MAX_SHIPPING_FEE) {
    return res.status(400).json({ success: false, message: 'Tổng tiền đơn hàng không khớp giá hiện tại. Vui lòng tải lại trang và thử lại.' });
  }

  const id = generateUniqueOrderId();

  const methodMap = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    vietqr: 'Chuyển khoản VietQR',
    banking: 'Chuyển khoản VietQR',
    momo: 'Ví MoMo',
  };
  const paymentMethod = methodMap[ord.paymentMethod] || methodMap[ord.phuongThucThanhToan] || ord.paymentMethod || ord.phuongThucThanhToan || 'Thanh toán khi nhận hàng (COD)';
  // Trạng thái ban đầu do server quyết định, không tin dữ liệu khách gửi
  const status = ord.paymentMethod === 'vietqr' ? AWAITING_QR_STATUS : DEFAULT_STATUS;
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
    subtotal,
    productDiscount,
    clientTotal,
    status,
    voucherCode,
    user.id
  );

  if (status === AWAITING_QR_STATUS) {
    await attachPayosPayment(req, id, {
      total: clientTotal,
      customerName,
      phone: targetPhone,
    });
  }

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
  const formatted = formatOrder(updated);
  if (formatted.statusCode === 'cancelled') cancelPayosLinkOf(updated);
  res.json(formatted);
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const rawId = req.params.id;
  const cleanId = rawId.replace(/^#+/, '');
  cancelPayosLinkOf(db.prepare('SELECT * FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').get(cleanId, '#' + cleanId));
  db.prepare('DELETE FROM don_hang WHERE ma_don_hang = ? OR ma_don_hang = ?').run(cleanId, '#' + cleanId);
  res.json({ success: true, id: cleanId });
});

export default router;
