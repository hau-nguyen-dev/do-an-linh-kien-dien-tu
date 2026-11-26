// Tạo backend/seed.sqlite: bản CSDL mẫu SẠCH (sản phẩm, danh mục, banner, bài viết, voucher...)
// không chứa đơn hàng, tài khoản khách, bình luận hay thông tin ngân hàng.
// Server dùng file này để khởi tạo CSDL lần đầu khi chưa có database.sqlite (ví dụ khi deploy).
// Chạy: node tools/make_seed_db.mjs
import { copyFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'backend');
const sourcePath = path.join(backendDir, 'database.sqlite');
const seedPath = path.join(backendDir, 'seed.sqlite');

const PERSONAL_DATA_TABLES = ['don_hang', 'nguoi_dung', 'binh_luan', 'giao_dich', 'quan_tri_vien'];
const BANK_SETTING_KEYS = ['bank_id', 'bank_name', 'bank_account_no', 'bank_account_name'];

if (!existsSync(sourcePath)) {
  console.error(`Không tìm thấy ${sourcePath}`);
  process.exit(1);
}

copyFileSync(sourcePath, seedPath);
const db = new DatabaseSync(seedPath);

const existingTables = new Set(
  db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name)
);

for (const table of PERSONAL_DATA_TABLES) {
  if (existingTables.has(table)) {
    db.exec(`DELETE FROM ${table};`);
  }
}
if (existingTables.has('danh_gia')) {
  db.exec("UPDATE danh_gia SET so_dien_thoai = '';");
}
if (existingTables.has('cai_dat_cua_hang')) {
  const stmt = db.prepare('DELETE FROM cai_dat_cua_hang WHERE khoa = ?');
  BANK_SETTING_KEYS.forEach((key) => stmt.run(key));
}

db.exec('VACUUM;');
db.close();

// Bỏ file nhật ký đi kèm (nếu có) để seed chỉ gồm một file duy nhất
for (const suffix of ['-wal', '-shm', '-journal']) {
  rmSync(seedPath + suffix, { force: true });
}
console.log(`Đã tạo ${seedPath}`);
