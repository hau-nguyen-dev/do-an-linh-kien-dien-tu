import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log('--- KHỞI TẠO CƠ SỞ DỮ LIỆU SQLITE THỰC TẾ ---');
console.log('Vị trí database:', dbPath);

const db = new DatabaseSync(dbPath);

// 1. Thực thi cấu trúc Schema
console.log('1. Đang áp dụng schema.sql...');
const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schemaSql);

// 2. Thực thi nạp dữ liệu Seed
console.log('2. Đang nạp dữ liệu thật từ seed.sql...');
const seedSql = fs.readFileSync(seedPath, 'utf-8');
db.exec(seedSql);

// 3. Kiểm tra số lượng bản ghi đã nạp
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
const voucherCount = db.prepare('SELECT COUNT(*) as count FROM vouchers').get().count;
const bannerCount = db.prepare('SELECT COUNT(*) as count FROM banners').get().count;
const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
const faqCount = db.prepare('SELECT COUNT(*) as count FROM faqs').get().count;
const settingCount = db.prepare('SELECT COUNT(*) as count FROM store_settings').get().count;

console.log('--------------------------------------------------');
console.log(`✅ Khởi tạo cơ sở dữ liệu thành công!`);
console.log(`- Sản phẩm (Products):      ${productCount} sản phẩm`);
console.log(`- Danh mục (Categories):    ${categoryCount} danh mục`);
console.log(`- Mã ưu đãi (Vouchers):     ${voucherCount} mã`);
console.log(`- Banner chiến dịch:        ${bannerCount} banners (Hero + Promo)`);
console.log(`- Bài viết công nghệ:       ${articleCount} bài viết`);
console.log(`- Câu hỏi thường gặp:       ${faqCount} FAQs`);
console.log(`- Cấu hình cửa hàng:        ${settingCount} cấu hình (Hotline, Showroom, USPs)`);
console.log('--------------------------------------------------');
console.log('💡 Bây giờ bạn có thể bấm vào backend/database.sqlite trên VS Code');
console.log('   để xem bảng trực quan qua extension SQLite Viewer!');

db.close();

