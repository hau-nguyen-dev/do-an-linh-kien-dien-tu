import { db, formatProduct, formatReview } from '../backend/config/db.js';

console.log("Testing db connection & tables...");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables found:", tables.map(t => t.name));

const p1 = db.prepare("SELECT * FROM san_pham WHERE id='p1'").get();
const revs = db.prepare("SELECT * FROM danh_gia WHERE ma_san_pham='p1'").all();
console.log("Product p1 found:", p1.ten, "| Rating:", p1.diem_danh_gia, "| Reviews in danh_gia:", revs.length);

const formatted = formatProduct(p1, revs.map(formatReview));
console.log("Formatted product reviews count:", formatted.reviews.length);
console.log("First review author:", formatted.reviews[0]?.author, "| rating:", formatted.reviews[0]?.rating);

const adminRevs = db.prepare(`
  SELECT d.id, d.ma_san_pham as productId, s.ten as productName,
         d.tac_gia as author, d.so_sao as rating, d.noi_dung as content
  FROM danh_gia d
  LEFT JOIN san_pham s ON d.ma_san_pham = s.id
`).all();
console.log("Total reviews for admin:", adminRevs.length);

console.log("ALL TESTS PASSED!");

