// Gộp toàn bộ danh mục mẫu theo thứ tự hiển thị: Điện thoại, Laptop, Máy tính bảng, Âm thanh, Đồng hồ, Phụ kiện.
import { PHONES } from './phones.js';
import { LAPTOPS } from './laptops.js';
import { TABLETS } from './tablets.js';
import { AUDIO } from './audio.js';
import { WATCHES } from './watches.js';
import { ACCESSORIES } from './accessories.js';

export const CATALOG = [...PHONES, ...LAPTOPS, ...TABLETS, ...AUDIO, ...WATCHES, ...ACCESSORIES];
