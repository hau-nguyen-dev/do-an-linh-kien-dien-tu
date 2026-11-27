// Vẽ ảnh minh họa SVG cho danh mục sản phẩm mẫu vào frontend/src/assets/img/products/<mã sản phẩm>/.
// Mỗi sản phẩm: 1 ảnh mặt trước cho mỗi màu, 1 ảnh mặt sau, (ảnh góc nghiêng nếu chỉ có 1 màu), 1 thẻ thông số.
// Chạy: node tools/catalog/render_images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG } from '../../backend/catalog/data/index.js';
import { imagePlan } from '../../backend/catalog/images.js';
import { BRAND_LABELS, CATEGORY_LABELS } from '../../backend/catalog/build.js';
import { DEVICES, FONT, esc, luminance, mix, shade } from './devices.mjs';

const FRONTEND_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'frontend');
const STORE_BLUE = '#0275A9';
const CENTER_X = 400;
const CENTER_Y = 340;
const WIDE_SHAPES = new Set(['laptop', 'powerbank']);
const CARD_BOTTOM_LIMIT = 640;

function defs(hex) {
  return `<defs>
<linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(hex, 0.16)}"/><stop offset="0.55" stop-color="${hex}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(hex, '#3B5BDB', 0.45)}"/><stop offset="1" stop-color="${mix(hex, '#0B1020', 0.62)}"/></linearGradient>
<radialGradient id="glass" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#4A5672"/><stop offset="0.6" stop-color="#12141A"/><stop offset="1" stop-color="#050607"/></radialGradient>
<radialGradient id="steel" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="#F4F5F7"/><stop offset="0.7" stop-color="#C3C7CC"/><stop offset="1" stop-color="#9DA1A7"/></radialGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#0F172A" stop-opacity="0.22"/><stop offset="1" stop-color="#0F172A" stop-opacity="0"/></radialGradient>
<pattern id="grille" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.2" fill="${shade(hex, -0.35)}"/></pattern>
</defs>`;
}

// Nền trong suốt để ảnh hòa vào khung thẻ sản phẩm và trang chi tiết
function svgDocument(label, hex, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="${esc(label)}">${defs(hex)}`
    + `${content}</svg>\n`;
}

function place(svg, { dx = 0, dy = 0, angle = 0, scale = 1 }) {
  return `<g transform="translate(${dx} ${dy}) translate(${CENTER_X} ${CENTER_Y}) rotate(${angle}) scale(${scale}) translate(${-CENTER_X} ${-CENTER_Y})">${svg}</g>`;
}

/** Chia chữ thành tối đa maxLines dòng, mỗi dòng khoảng maxChars ký tự; dòng cuối thêm "…" nếu còn dư. */
function wrap(text, maxChars, maxLines) {
  const lines = [];
  let current = '';
  const words = String(text).split(/\s+/);
  for (let i = 0; i < words.length; i += 1) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    if (candidate.length <= maxChars || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = words[i];
    if (lines.length === maxLines) {
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:-]+$/, '')}…`;
      return lines;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function deviceArt(product, shot) {
  const device = DEVICES[product.shape];
  const look = { ...product.look, brandLabel: product.brand === 'apple' ? '' : BRAND_LABELS[product.brand] };
  const hex = shot.color.hex;
  if (shot.view === 'front') return device.front(hex, look);
  if (shot.view === 'back') return device.back(hex, look);
  // Góc nghiêng: mặt sau phía sau, mặt trước phía trước
  if (WIDE_SHAPES.has(product.shape)) {
    return place(device.back(hex, look), { dy: -80, scale: 0.6 }) + place(device.front(hex, look), { dy: 70, scale: 0.78 });
  }
  return place(device.back(hex, look), { dx: -105, angle: -8, scale: 0.8 }) + place(device.front(hex, look), { dx: 105, angle: 6, scale: 0.8 });
}

// Thiết bị được vẽ trong vùng y 60-620; dời xuống để nằm giữa khung 800 x 800 (tên sản phẩm đã có trên trang)
const SHOT_OFFSET_Y = 60;
// Phóng to các vật nhỏ để mọi sản phẩm lấp khung tương đương nhau
const SHAPE_SCALE = { earbuds: 1.35, charger: 1.4, tracker: 1.25, speaker: 1.15, watch: 1.12, powerbank: 1.12, headphones: 1.12 };

function productShot(product, shot) {
  const viewLabel = { front: '', back: 'mặt sau, ', side: 'góc nghiêng, ' }[shot.view];
  const scale = SHAPE_SCALE[product.shape] || 1;
  const shadow = `<ellipse cx="400" cy="${640 + SHOT_OFFSET_Y}" rx="240" ry="26" fill="url(#shadow)"/>`;
  const art = `<g transform="translate(0 ${SHOT_OFFSET_Y})">${place(deviceArt(product, shot), { scale })}</g>`;
  return svgDocument(`${product.name} - ${viewLabel}${shot.color.name}`, shot.color.hex, shadow + art);
}

function specRows(product, startY) {
  let y = startY;
  let out = '';
  for (const [key, value] of Object.entries(product.specs)) {
    const lines = wrap(value, 46, 2);
    const rowHeight = 26 + lines.length * 27 + 16;
    if (y + rowHeight > CARD_BOTTOM_LIMIT) break;
    out += `<text x="96" y="${y + 18}" font-family="${FONT}" font-size="15" fill="#707783">${esc(key)}</text>`;
    lines.forEach((line, i) => {
      out += `<text x="96" y="${y + 46 + i * 27}" font-family="${FONT}" font-size="20" font-weight="600" fill="#141923">${esc(line)}</text>`;
    });
    y += rowHeight;
    out += `<line x1="96" y1="${y - 8}" x2="704" y2="${y - 8}" stroke="#EEF1F4" stroke-width="2"/>`;
  }
  return out;
}

function specCard(product, shot) {
  const accent = luminance(shot.color.hex) > 0.72 ? STORE_BLUE : shot.color.hex;
  const brand = BRAND_LABELS[product.brand];
  const pillWidth = 34 + brand.length * 11;
  const nameLines = wrap(product.name, 24, 2);
  const nameSvg = nameLines.map((line, i) => `<text x="96" y="${206 + i * 48}" font-family="${FONT}" font-size="40" font-weight="800" fill="#141923">${esc(line)}</text>`).join('');
  const specsTop = 206 + nameLines.length * 48 + 22;
  const swatches = product.colors.map((c, i) => `<circle cx="${110 + i * 40}" cy="690" r="14" fill="${c.hex}" stroke="#CBD5E1" stroke-width="2"/>`).join('');
  const content = `<rect x="56" y="56" width="688" height="688" rx="36" fill="#ffffff" stroke="#E5E8EC" stroke-width="2"/>`
    + `<rect x="96" y="56" width="140" height="8" rx="4" fill="${accent}"/>`
    + `<rect x="96" y="104" width="${pillWidth}" height="34" rx="17" fill="${mix(accent, '#ffffff', 0.86)}"/>`
    + `<text x="${96 + pillWidth / 2}" y="127" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="${shade(accent, -0.35)}">${esc(brand)}</text>`
    + `<text x="704" y="127" text-anchor="end" font-family="${FONT}" font-size="16" fill="#707783">${esc(CATEGORY_LABELS[product.category])}</text>`
    + nameSvg
    + `<text x="96" y="${specsTop}" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="3" fill="#707783">THÔNG SỐ NỔI BẬT</text>`
    + specRows(product, specsTop + 14)
    + swatches
    + `<text x="${110 + product.colors.length * 40}" y="696" font-family="${FONT}" font-size="17" fill="#475569">${product.colors.length} màu sắc</text>`
    + `<text x="704" y="697" text-anchor="end" font-family="${FONT}" font-size="18" font-weight="800" fill="${STORE_BLUE}">nét. Tech Store</text>`;
  return svgDocument(`${product.name} - thông số nổi bật`, shot.color.hex, content);
}

function renderAll() {
  let written = 0;
  for (const product of CATALOG) {
    if (!DEVICES[product.shape]) throw new Error(`Chưa có hình vẽ cho loại "${product.shape}" (${product.id})`);
    for (const shot of imagePlan(product).all) {
      const target = path.join(FRONTEND_DIR, ...shot.file.split('/'));
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, shot.view === 'card' ? specCard(product, shot) : productShot(product, shot), 'utf8');
      written += 1;
    }
  }
  console.log(`Đã vẽ ${written} ảnh cho ${CATALOG.length} sản phẩm.`);
}

renderAll();
