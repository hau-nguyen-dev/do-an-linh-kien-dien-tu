// Kiểm thử danh mục sản phẩm mẫu: dữ liệu đủ trường, ảnh tồn tại, biến thể đúng giá/tồn kho,
// lệnh nhập chạy lại an toàn, và khách đặt được biến thể mới qua bước kiểm tra giá của server.
// Chạy: node tools/test_catalog.mjs  (dùng bản sao seed.sqlite trong thư mục tạm)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { CATALOG } from '../backend/catalog/data/index.js';
import { BRAND_LABELS, CATEGORY_LABELS, buildCatalogRows } from '../backend/catalog/build.js';
import { LEGACY_TEST_PRODUCT_ID, importCatalog } from '../backend/catalog/import.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 5058;
const BASE = `http://127.0.0.1:${PORT}/api`;
const rows = buildCatalogRows();
const json = (text) => JSON.parse(text);

let tmpDir;
let dbFile;

before(() => {
  tmpDir = mkdtempSync(path.join(tmpdir(), 'net-catalog-'));
  dbFile = path.join(tmpDir, 'test.sqlite');
  copyFileSync(path.join(root, 'backend', 'seed.sqlite'), dbFile);
  // seed.sqlite đã chứa danh mục; xóa khỏi bản sao để kiểm thử đúng tình huống nhập lần đầu vào CSDL cũ
  const db = new DatabaseSync(dbFile);
  const ids = rows.map((r) => r.id);
  db.prepare(`DELETE FROM san_pham WHERE id IN (${ids.map(() => '?').join(',')})`).run(...ids);
  db.close();
});

after(() => {
  rmSync(tmpDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
});

test('mỗi danh mục có ít nhất 5 sản phẩm, đủ 5 thương hiệu, điện thoại có cả 5 hãng', () => {
  for (const category of Object.keys(CATEGORY_LABELS)) {
    assert.ok(rows.filter((r) => r.ma_danh_muc === category).length >= 5, category);
  }
  assert.deepEqual(new Set(rows.map((r) => r.thuong_hieu)), new Set(Object.keys(BRAND_LABELS)));
  assert.equal(new Set(rows.filter((r) => r.ma_danh_muc === 'phones').map((r) => r.thuong_hieu)).size, 5);
});

test('mức giá đa dạng: có sản phẩm dưới 1 triệu, 10-20 triệu và trên 20 triệu', () => {
  const prices = rows.map((r) => r.gia_ban);
  assert.ok(prices.some((p) => p < 1_000_000));
  assert.ok(prices.some((p) => p >= 10_000_000 && p <= 20_000_000));
  assert.ok(prices.some((p) => p > 20_000_000));
});

test('mã sản phẩm duy nhất, dạng đường dẫn an toàn; đủ thông tin cơ bản và giá gốc >= giá bán', () => {
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
  for (const r of rows) {
    assert.match(r.id, /^[a-z0-9-]+$/);
    for (const field of ['ten', 'ten_day_du', 'ten_thuong_hieu', 'ten_danh_muc', 'thong_so_ngan']) assert.ok(r[field], `${r.id}.${field}`);
    assert.ok(r.gia_goc >= r.gia_ban, r.id);
    assert.equal(r.giam_tru_truc_tiep, r.gia_goc - r.gia_ban);
    assert.equal(r.trang_thai, 'active');
  }
});

test('mỗi sản phẩm có 4-5 ảnh trong album, ảnh chính là ảnh đầu, mọi ảnh (cả ảnh biến thể) đều có file', () => {
  for (const r of rows) {
    const album = json(r.album_anh);
    assert.ok(album.length >= 4 && album.length <= 5, `${r.id}: ${album.length} ảnh`);
    assert.equal(r.hinh_anh, album[0]);
    const variantImages = json(r.bien_the).map((v) => v.img);
    for (const file of new Set([...album, ...variantImages])) {
      assert.ok(existsSync(path.join(root, 'frontend', ...file.split('/'))), `${r.id}: thiếu ${file}`);
    }
  }
});

test('biến thể: đủ mọi tổ hợp màu x phiên bản, giá không thấp hơn giá bán, tồn kho cộng đúng', () => {
  for (const product of CATALOG) {
    const row = rows.find((r) => r.id === product.id);
    const groups = json(row.nhom_phan_loai);
    const variants = json(row.bien_the);
    assert.deepEqual(groups.map((g) => g.name), ['Màu sắc', product.option.name]);
    assert.equal(variants.length, product.colors.length * product.option.values.length, product.id);
    for (const v of variants) {
      assert.deepEqual(v.options, [v.group1, v.group2]);
      assert.ok(v.price >= row.gia_ban, `${v.name} rẻ hơn giá bán`);
      assert.equal(v.originalPrice - v.price, row.gia_goc - row.gia_ban);
      assert.ok(Number.isInteger(v.stock) && v.stock >= 0);
    }
    assert.equal(row.ton_kho, variants.reduce((sum, v) => sum + v.stock, 0));
    for (const soldOut of product.outOfStock || []) assert.equal(variants.find((v) => v.name === soldOut).stock, 0);
  }
});

test('bài viết có bảng thông số chứa mọi dòng thông số, mục bộ sản phẩm & bảo hành, và đã thoát ký tự HTML', () => {
  for (const product of CATALOG) {
    const html = rows.find((r) => r.id === product.id).bai_viet_mo_ta;
    assert.match(html, /<table>.*<\/table>/s);
    for (const key of Object.keys(product.specs)) assert.ok(html.includes(`<th>${key.replace(/&/g, '&amp;')}</th>`), `${product.id}: ${key}`);
    assert.ok(html.includes('Bộ sản phẩm &amp; bảo hành'));
    assert.equal(/<script/i.test(html), false);
  }
});

test('nhập CSDL: lần đầu thêm đủ, chạy lại không tạo bản trùng, --update giữ lượt đánh giá; sản phẩm thử bị ẩn', () => {
  const db = new DatabaseSync(dbFile);
  try {
    const first = importCatalog(db);
    assert.equal(first.inserted, rows.length);
    const second = importCatalog(db);
    assert.deepEqual([second.inserted, second.skipped], [0, rows.length]);

    db.prepare('UPDATE san_pham SET so_luot_danh_gia = 3, gia_ban = 1 WHERE id = ?').run(rows[0].id);
    assert.equal(importCatalog(db).skipped, rows.length, 'mặc định không ghi đè dữ liệu admin đã sửa');
    assert.equal(db.prepare('SELECT gia_ban FROM san_pham WHERE id = ?').get(rows[0].id).gia_ban, 1);

    assert.equal(importCatalog(db, { update: true }).updated, rows.length);
    const updated = db.prepare('SELECT gia_ban, so_luot_danh_gia FROM san_pham WHERE id = ?').get(rows[0].id);
    assert.deepEqual({ ...updated }, { gia_ban: rows[0].gia_ban, so_luot_danh_gia: 3 });

    const legacy = db.prepare('SELECT trang_thai FROM san_pham WHERE id = ?').get(LEGACY_TEST_PRODUCT_ID);
    if (legacy) assert.equal(legacy.trang_thai, 'inactive');
    const ids = rows.map((r) => r.id);
    const stored = db.prepare(`SELECT COUNT(*) AS c FROM san_pham WHERE id IN (${ids.map(() => '?').join(',')})`).get(...ids).c;
    assert.equal(stored, rows.length);
  } finally {
    db.close();
  }
});

test('server: trả sản phẩm mới qua API và khách đặt được biến thể đắt hơn giá gốc', async () => {
  const server = spawn(process.execPath, [path.join(root, 'backend', 'server.js')], {
    env: { ...process.env, PORT: String(PORT), DB_PATH: dbFile, ADMIN_USERNAME: 'testadmin', ADMIN_PASSWORD: 'Matkhau-Test-123', ADMIN_TOKEN_SECRET: 'test-secret' },
    stdio: 'ignore',
  });
  try {
    for (let i = 0; i < 50; i += 1) {
      try { if ((await fetch(`${BASE}/health`)).ok) break; } catch { /* server chưa sẵn sàng */ }
      await new Promise((r) => setTimeout(r, 200));
    }
    const products = await (await fetch(`${BASE}/products`)).json();
    const ipad = products.find((p) => p.id === 'apple-ipad-air-11-m3');
    assert.equal(ipad.gallery.length, 5);
    assert.equal(ipad.variantGroups[1].name, 'Dung lượng (Wi-Fi)');

    const variant = ipad.variants.find((v) => v.name === 'Tím · 512 GB');
    const reg = await fetch(`${BASE}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '0930000001', fullName: 'Khach Danh Muc', password: 'matkhau-dai-1' }),
    }).then((r) => r.json());
    const order = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
      body: JSON.stringify({
        address: 'Hue', paymentMethod: 'cod', total: variant.price, subtotal: variant.price,
        items: [{ id: ipad.id, name: `${ipad.name} (${variant.name})`, price: variant.price, quantity: 1 }],
      }),
    });
    assert.equal(order.status, 201, JSON.stringify(await order.clone().json()));
  } finally {
    const exited = new Promise((resolve) => server.once('exit', resolve));
    server.kill();
    await exited;
  }
});
