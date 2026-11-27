// Dựng bản ghi bảng san_pham từ dữ liệu danh mục mẫu (backend/catalog/data).
// Mỗi sản phẩm khai báo gọn (màu, một nhóm phiên bản, thông số, bài viết); file này sinh ra
// đủ các cột mà frontend và admin đang dùng: nhóm phân loại, tổ hợp biến thể, album, bài viết HTML.
import { CATALOG } from './data/index.js';
import { imagePlan } from './images.js';

export const BRAND_LABELS = { apple: 'Apple', samsung: 'Samsung', xiaomi: 'Xiaomi', oppo: 'OPPO', sony: 'Sony' };
export const CATEGORY_LABELS = {
  phones: 'Điện thoại',
  laptops: 'Laptop',
  tablets: 'Máy tính bảng',
  audio: 'Âm thanh',
  watches: 'Đồng hồ',
  accessories: 'Phụ kiện',
};
const COLOR_GROUP_NAME = 'Màu sắc';
const INSTALLMENT_MIN_PRICE = 3_000_000;
// Tồn kho giảm dần theo phiên bản đắt hơn (phiên bản 1 = 100%, 2 = 60%, từ 3 trở đi = 30%)
const STOCK_FALLOFF = [1, 0.6, 0.3];

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function variantStock(product, colorIndex, optionIndex, variantName) {
  if ((product.outOfStock || []).includes(variantName)) return 0;
  const falloff = STOCK_FALLOFF[Math.min(optionIndex, STOCK_FALLOFF.length - 1)];
  return Math.max(1, Math.round(product.stock * falloff) - colorIndex);
}

/** Nhóm phân loại (Màu sắc + một nhóm phiên bản) và mọi tổ hợp biến thể kèm giá, tồn kho, ảnh. */
export function buildVariants(product) {
  const { all } = imagePlan(product);
  const colorImages = all.filter((shot) => shot.view === 'front').map((shot) => shot.file);

  const groups = [
    {
      id: 'mau',
      name: COLOR_GROUP_NAME,
      options: product.colors.map((color, i) => ({ id: `mau_${i + 1}`, name: color.name, img: colorImages[i], priceDiff: 0 })),
    },
    {
      id: 'phien_ban',
      name: product.option.name,
      options: product.option.values.map((value, j) => ({ id: `pb_${j + 1}`, name: value.name, img: '', priceDiff: value.diff })),
    },
  ];

  const variants = [];
  product.colors.forEach((color, i) => {
    product.option.values.forEach((value, j) => {
      const name = `${color.name} · ${value.name}`;
      const price = product.price + value.diff;
      const originalPrice = product.originalPrice + value.diff;
      variants.push({
        id: `bt_${i + 1}_${j + 1}`,
        key: name,
        name,
        options: [color.name, value.name],
        group1: color.name,
        group2: value.name,
        img: colorImages[i],
        originalPrice,
        hasDiscount: originalPrice > price,
        price,
        priceDiff: value.diff,
        stock: variantStock(product, i, j, name),
      });
    });
  });

  return { groups, variants, totalStock: variants.reduce((sum, v) => sum + v.stock, 0) };
}

function specTable(product) {
  const rows = Object.entries(product.specs)
    .map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join('');
  return `<table><thead><tr><th>Thông số</th><th>Chi tiết</th></tr></thead><tbody>${rows}</tbody></table>`;
}

/** Bài viết mô tả: giới thiệu, các điểm nổi bật, bảng thông số kỹ thuật, phiên bản, bộ sản phẩm & bảo hành. */
export function buildArticle(product) {
  const { article } = product;
  const sections = article.sections
    .map((section, i) => `<h3>${i + 1}. ${escapeHtml(section.title)}</h3><p>${escapeHtml(section.body)}</p>`)
    .join('');
  const versions = [
    `<li><strong>${COLOR_GROUP_NAME}:</strong> ${escapeHtml(product.colors.map((c) => c.name).join(', '))}</li>`,
    `<li><strong>${escapeHtml(product.option.name)}:</strong> ${escapeHtml(product.option.values.map((v) => v.name).join(', '))}</li>`,
  ].join('');

  return [
    `<p><strong>${escapeHtml(product.fullName)}</strong> ${escapeHtml(article.intro)}</p>`,
    sections,
    `<h3>Thông số kỹ thuật ${escapeHtml(product.name)}</h3>`,
    specTable(product),
    '<h3>Phiên bản &amp; màu sắc</h3>',
    `<ul>${versions}</ul>`,
    '<h3>Bộ sản phẩm &amp; bảo hành</h3>',
    `<ul><li><strong>Bộ sản phẩm:</strong> ${escapeHtml(article.box)}</li><li><strong>Bảo hành:</strong> ${escapeHtml(article.warranty)}</li></ul>`,
  ].join('');
}

/** Một bản ghi đúng cột bảng san_pham. */
export function toRow(product) {
  const { album } = imagePlan(product);
  const { groups, variants, totalStock } = buildVariants(product);
  return {
    id: product.id,
    duong_dan: product.id,
    ten: product.name,
    ten_day_du: product.fullName,
    thuong_hieu: product.brand,
    ten_thuong_hieu: BRAND_LABELS[product.brand],
    ma_danh_muc: product.category,
    ten_danh_muc: CATEGORY_LABELS[product.category],
    gia_ban: product.price,
    gia_goc: product.originalPrice,
    giam_tru_truc_tiep: Math.max(0, product.originalPrice - product.price),
    co_tra_gop: product.price >= INSTALLMENT_MIN_PRICE ? 1 : 0,
    hinh_anh: album[0],
    album_anh: JSON.stringify(album),
    thong_so_ngan: product.specsShort,
    thong_so_ky_thuat: JSON.stringify(product.specs),
    qua_tang: product.gift || '',
    huy_hieu: product.badge || '',
    bai_viet_mo_ta: buildArticle(product),
    nhom_phan_loai: JSON.stringify(groups),
    bien_the: JSON.stringify(variants),
    ton_kho: totalStock,
    trang_thai: product.status || 'active',
  };
}

export function buildCatalogRows(catalog = CATALOG) {
  return catalog.map(toRow);
}
