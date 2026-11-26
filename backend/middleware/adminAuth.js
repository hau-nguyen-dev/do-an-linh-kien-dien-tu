import crypto from 'node:crypto';
import { db } from '../config/db.js';

// Thời hạn phiên theo vai trò: admin ngắn hơn khách hàng
const TOKEN_TTL_MS = { admin: 8 * 60 * 60 * 1000, customer: 7 * 24 * 60 * 60 * 1000 };
const SCRYPT_KEYLEN = 64;
const MIN_PASSWORD_LENGTH = 8;

// Khoa ky token: bat buoc dat ADMIN_TOKEN_SECRET khi deploy. Neu thieu, sinh ngau nhien
// (token se mat hieu luc moi lan khoi dong lai server).
const tokenSecret = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.ADMIN_TOKEN_SECRET) {
  console.warn('[Admin Auth] Chua dat ADMIN_TOKEN_SECRET - dung khoa tam thoi, phien dang nhap se mat khi restart.');
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = Buffer.from(crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex'));
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function sign(payloadB64) {
  return crypto.createHmac('sha256', tokenSecret).update(payloadB64).digest('base64url');
}

// role: 'admin' (sub = tên đăng nhập) hoặc 'customer' (sub = số điện thoại). Token của vai trò này
// không dùng được cho vai trò kia.
export function issueToken(subject, role = 'admin') {
  const payload = Buffer.from(JSON.stringify({ sub: subject, role, exp: Date.now() + TOKEN_TTL_MS[role] })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string') return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function authenticateAdmin(username, password) {
  const row = db.prepare('SELECT * FROM quan_tri_vien WHERE ten_dang_nhap = ?').get(String(username || '').trim());
  if (!row) {
    // Van ton thoi gian bam de han che do thoi gian phan hoi phan biet user ton tai
    hashPassword(String(password || ''), '0'.repeat(32));
    return false;
  }
  return verifyPassword(String(password || ''), row.muoi, row.mat_khau_bam);
}

export function changeAdminPassword(username, newPassword) {
  const { hash, salt } = hashPassword(newPassword);
  db.prepare('UPDATE quan_tri_vien SET mat_khau_bam = ?, muoi = ? WHERE ten_dang_nhap = ?').run(hash, salt, username);
}

export function isValidNewPassword(password) {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
}

/** Tao tai khoan admin dau tien tu bien moi truong (khong hard-code mat khau trong ma nguon). */
export function ensureAdminSeed() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM quan_tri_vien').get();
  if (count > 0) return;
  const username = (process.env.ADMIN_USERNAME || '').trim();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!username || !isValidNewPassword(password)) {
    console.warn('[Admin Auth] Chua co tai khoan admin. Dat ADMIN_USERNAME va ADMIN_PASSWORD (>= 8 ky tu) trong backend/.env roi khoi dong lai.');
    return;
  }
  const { hash, salt } = hashPassword(password);
  db.prepare('INSERT INTO quan_tri_vien (ten_dang_nhap, mat_khau_bam, muoi) VALUES (?, ?, ?)').run(username, hash, salt);
  console.log(`[Admin Auth] Da tao tai khoan admin "${username}".`);
}

function sessionFromRequest(req, role) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = verifyToken(token);
  return session && session.role === role ? session : null;
}

export const getAdminSession = (req) => sessionFromRequest(req, 'admin');
export const getCustomerSession = (req) => sessionFromRequest(req, 'customer');

export function requireCustomer(req, res, next) {
  const session = getCustomerSession(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này.' });
  }
  req.customer = session;
  next();
}

// Mật khẩu khách hàng lưu dạng scrypt$muối$băm. Mật khẩu cũ (văn bản thô) vẫn đọc được
// để nâng cấp ngay lần đăng nhập kế tiếp.
export function encodePassword(password) {
  const { hash, salt } = hashPassword(password);
  return `scrypt$${salt}$${hash}`;
}

export function checkStoredPassword(password, stored) {
  const text = String(stored || '');
  if (text.startsWith('scrypt$')) {
    const [, salt, hash] = text.split('$');
    return { ok: Boolean(salt && hash) && verifyPassword(String(password), salt, hash), legacy: false };
  }
  const a = Buffer.from(String(password));
  const b = Buffer.from(text);
  return { ok: a.length === b.length && crypto.timingSafeEqual(a, b), legacy: true };
}

export function requireAdmin(req, res, next) {
  const session = getAdminSession(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Cần đăng nhập quản trị để thực hiện thao tác này.' });
  }
  req.admin = session;
  next();
}

// Cac thao tac ghi cong khai (khach hang dung) - moi thao tac ghi khac deu can quyen admin.
const PUBLIC_WRITES = [
  ['POST', /^\/api\/auth\/(register|login)$/],
  ['PUT', /^\/api\/auth\/profile$/],
  ['POST', /^\/api\/orders$/],
  ['POST', /^\/api\/comments$/],
  ['POST', /^\/api\/products\/[^/]+\/reviews$/],
  ['POST', /^\/api\/vouchers\/validate$/],
  ['POST', /^\/api\/admin\/login$/],
];
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function guardWrites(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  // Khi gắn bằng app.use('/api', ...), req.path đã bị cắt tiền tố nên phải ghép lại baseUrl
  const fullPath = req.baseUrl + req.path;
  const isPublic = PUBLIC_WRITES.some(([method, pattern]) => method === req.method && pattern.test(fullPath));
  if (isPublic) return next();
  return requireAdmin(req, res, next);
}
