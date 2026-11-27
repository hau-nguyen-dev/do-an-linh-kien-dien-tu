// Nhập danh mục sản phẩm mẫu vào CSDL SQLite.
//   node backend/catalog/import.js [đường_dẫn_CSDL] [--update] [--no-backup]
// Mặc định chỉ THÊM sản phẩm chưa có (không ghi đè giá, tồn kho admin đã sửa). --update đưa MỌI cột danh mục
// (kể cả giá bán, tồn kho, trạng thái bán) về giá trị mẫu, chỉ giữ điểm và lượt đánh giá. Luôn sao lưu CSDL trước khi ghi.
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { buildCatalogRows } from './build.js';

// Sản phẩm thử nhập tay trước đây ("iPhone 16 Progg", giá 284.900₫) - ẩn khỏi cửa hàng, không xóa vì đơn thử có thể tham chiếu
export const LEGACY_TEST_PRODUCT_ID = 'p_1792929478854';
const BUSY_TIMEOUT_MS = 5000;
const KNOWN_FLAGS = new Set(['--update', '--no-backup']);

const CATALOG_COLUMNS = [
  'id', 'duong_dan', 'ten', 'ten_day_du', 'thuong_hieu', 'ten_thuong_hieu', 'ma_danh_muc', 'ten_danh_muc',
  'gia_ban', 'gia_goc', 'giam_tru_truc_tiep', 'co_tra_gop', 'hinh_anh', 'album_anh', 'thong_so_ngan',
  'thong_so_ky_thuat', 'qua_tang', 'huy_hieu', 'bai_viet_mo_ta', 'nhom_phan_loai', 'bien_the', 'ton_kho', 'trang_thai',
];

// Bản sao lưu nằm cạnh CSDL, đuôi .sqlite để .gitignore (*.sqlite) không đưa nhầm vào git
function backupDatabase(db, dbPath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = dbPath.replace(/(\.sqlite)?$/, `.truoc-nhap-danh-muc-${stamp}.sqlite`);
  db.exec(`VACUUM INTO '${backupPath.replace(/'/g, "''")}'`);
  return backupPath;
}

/** Ghi danh mục vào CSDL đã mở; trả về số sản phẩm thêm mới, cập nhật, bỏ qua và việc ẩn sản phẩm thử. */
export function importCatalog(db, { update = false, rows = buildCatalogRows() } = {}) {
  const placeholders = CATALOG_COLUMNS.map(() => '?').join(', ');
  const insert = db.prepare(`
    INSERT INTO san_pham (${CATALOG_COLUMNS.join(', ')}, diem_danh_gia, so_luot_danh_gia, danh_gia)
    VALUES (${placeholders}, 5.0, 0, '[]')
  `);
  const updateSet = CATALOG_COLUMNS.filter((c) => c !== 'id').map((c) => `${c} = ?`).join(', ');
  const overwrite = db.prepare(`UPDATE san_pham SET ${updateSet} WHERE id = ?`);
  const exists = db.prepare('SELECT 1 FROM san_pham WHERE id = ?');
  const slugTakenByOther = db.prepare('SELECT id FROM san_pham WHERE duong_dan = ? AND id <> ?');

  const result = { inserted: 0, updated: 0, skipped: 0, hiddenLegacy: false };
  // Server có thể đang ghi cùng lúc: chờ khóa tối đa 5 giây và giữ khóa ghi ngay từ đầu transaction
  db.exec(`PRAGMA busy_timeout = ${BUSY_TIMEOUT_MS}`);
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const row of rows) {
      const conflict = slugTakenByOther.get(row.duong_dan, row.id);
      if (conflict) throw new Error(`Đường dẫn "${row.duong_dan}" đã được sản phẩm ${conflict.id} dùng`);
      const values = CATALOG_COLUMNS.map((c) => row[c]);
      if (!exists.get(row.id)) {
        insert.run(...values);
        result.inserted += 1;
      } else if (update) {
        overwrite.run(...values.slice(1), row.id);
        result.updated += 1;
      } else {
        result.skipped += 1;
      }
    }
    const hidden = db.prepare("UPDATE san_pham SET trang_thai = 'inactive' WHERE id = ? AND trang_thai = 'active'").run(LEGACY_TEST_PRODUCT_ID);
    result.hiddenLegacy = hidden.changes > 0;
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const unknownFlags = args.filter((a) => a.startsWith('--') && !KNOWN_FLAGS.has(a));
  if (unknownFlags.length > 0) {
    console.error(`Không hiểu tùy chọn: ${unknownFlags.join(', ')}. Chỉ hỗ trợ: ${[...KNOWN_FLAGS].join(', ')}`);
    process.exit(1);
  }
  const update = args.includes('--update');
  if (update) console.warn('Chế độ --update: giá bán, tồn kho và trạng thái bán sẽ trở về giá trị mẫu.');
  const defaultPath = process.env.DB_PATH || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'database.sqlite');
  const dbPath = path.resolve(args.find((a) => !a.startsWith('--')) || defaultPath);
  if (!existsSync(dbPath)) {
    console.error(`Không tìm thấy CSDL: ${dbPath}`);
    process.exit(1);
  }

  const db = new DatabaseSync(dbPath);
  try {
    // --no-backup chỉ dùng cho backend/seed.sqlite: bản cũ đã nằm trong git, không cần file sao lưu cạnh nó
    const backupPath = args.includes('--no-backup') ? null : backupDatabase(db, dbPath);
    const result = importCatalog(db, { update });
    console.log(backupPath ? `Đã sao lưu CSDL: ${backupPath}` : 'Bỏ qua sao lưu (--no-backup).');
    console.log(`Thêm mới ${result.inserted}, cập nhật ${result.updated}, bỏ qua (đã có) ${result.skipped} sản phẩm.`);
    console.log(result.hiddenLegacy ? 'Đã ẩn sản phẩm thử cũ khỏi cửa hàng.' : 'Sản phẩm thử cũ không có hoặc đã ẩn từ trước.');
  } finally {
    db.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main();
}
