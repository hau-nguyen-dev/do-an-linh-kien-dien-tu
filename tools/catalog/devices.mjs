// Hình vẽ SVG của từng loại thiết bị trong danh mục mẫu (khung 800 x 800, vật thể nằm trong vùng y 60-620).
// Mỗi loại có front() và back(); ảnh góc nghiêng ghép mặt sau + mặt trước (xem render_images.mjs).
// Các hàm dùng gradient khai báo sẵn trong file ảnh: url(#body), url(#wall), url(#glass), url(#grille), url(#steel).

export function mix(hexA, hexB, t) {
  const a = hexA.replace('#', '');
  const b = hexB.replace('#', '');
  const channel = (i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t);
  return `#${[0, 2, 4].map((i) => channel(i).toString(16).padStart(2, '0')).join('')}`;
}

/** amount > 0 pha trắng, amount < 0 pha đen. */
export function shade(hex, amount) {
  return amount >= 0 ? mix(hex, '#ffffff', amount) : mix(hex, '#000000', -amount);
}

export function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";
const INK = '#0B0C0E';

function edge(color) {
  return shade(color, -0.22);
}

function wordmark(text, x, y, color, size = 20) {
  if (!text) return '';
  const fill = luminance(color) > 0.55 ? shade(color, -0.45) : shade(color, 0.45);
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="700" letter-spacing="6" fill="${fill}" opacity="0.75">${esc(text.toUpperCase())}</text>`;
}

function lens(cx, cy, r, color) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#15161A" stroke="${shade(color, -0.3)}" stroke-width="4"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.62).toFixed(1)}" fill="url(#glass)"/>`
    + `<circle cx="${(cx - r * 0.25).toFixed(1)}" cy="${(cy - r * 0.25).toFixed(1)}" r="${(r * 0.17).toFixed(1)}" fill="#ffffff" opacity="0.55"/>`;
}

function flash(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F4EED8" stroke="#C9C3AE" stroke-width="2"/>`;
}

// ------------------------------------------------------------------ điện thoại

function phoneScreenContent(top) {
  const icons = [0, 1, 2, 3].map((i) => `<rect x="${306 + i * 52}" y="528" width="40" height="40" rx="11" fill="#ffffff" opacity="0.28"/>`).join('');
  return `<text x="400" y="${top + 140}" text-anchor="middle" font-family="${FONT}" font-size="66" font-weight="700" fill="#ffffff">09:41</text>`
    + `<text x="400" y="${top + 172}" text-anchor="middle" font-family="${FONT}" font-size="17" fill="#ffffff" opacity="0.85">Thứ Năm, 27 tháng 11</text>`
    + `<circle cx="352" cy="${top + 300}" r="70" fill="#ffffff" opacity="0.08"/><circle cx="452" cy="${top + 360}" r="90" fill="#ffffff" opacity="0.06"/>`
    + icons;
}

const phone = {
  front(color, look = {}) {
    const bezelTop = look.notch === 'bezel' ? 100 : 86;
    const notch = {
      island: `<rect x="362" y="100" width="76" height="22" rx="11" fill="${INK}"/>`,
      punch: `<circle cx="400" cy="111" r="9" fill="${INK}"/>`,
      bezel: `<circle cx="400" cy="91" r="4" fill="#2A2C31"/>`,
    }[look.notch || 'punch'];
    return `<rect x="270" y="70" width="260" height="540" rx="44" fill="${shade(color, -0.12)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="266" y="170" width="5" height="38" rx="2" fill="${edge(color)}"/><rect x="266" y="222" width="5" height="62" rx="2" fill="${edge(color)}"/>`
      + `<rect x="529" y="200" width="5" height="78" rx="2" fill="${edge(color)}"/>`
      + `<rect x="278" y="78" width="244" height="524" rx="37" fill="${INK}"/>`
      + `<rect x="286" y="${bezelTop}" width="228" height="${594 - bezelTop}" rx="31" fill="url(#wall)"/>`
      + phoneScreenContent(bezelTop) + notch;
  },
  back(color, look = {}) {
    const cameras = {
      plateau: `<rect x="284" y="86" width="232" height="150" rx="34" fill="${shade(color, -0.08)}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`
        + lens(334, 126, 28, color) + lens(334, 196, 28, color) + lens(404, 161, 28, color)
        + flash(470, 126, 10) + `<circle cx="470" cy="196" r="9" fill="#222326"/>`,
      vertical: lens(318, 122, 24, color) + lens(318, 184, 24, color) + lens(318, 246, 24, color)
        + lens(372, 122, 16, color) + flash(372, 170, 7),
      square: `<rect x="290" y="92" width="134" height="134" rx="30" fill="${shade(color, -0.08)}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`
        + lens(326, 128, 24, color) + lens(388, 128, 24, color) + lens(326, 190, 24, color) + flash(388, 190, 8),
      strip: `<rect x="292" y="92" width="56" height="154" rx="28" fill="#1B1C1F"/>`
        + lens(320, 126, 20, color) + lens(320, 186, 20, color) + flash(320, 228, 6),
    }[look.camera || 'square'];
    const mark = look.camera === 'plateau'
      ? `<circle cx="400" cy="380" r="62" fill="none" stroke="${shade(color, -0.1)}" stroke-width="3" opacity="0.7"/>`
      : wordmark(look.brandLabel, 400, 540, color);
    return `<rect x="270" y="70" width="260" height="540" rx="44" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="529" y="170" width="5" height="38" rx="2" fill="${edge(color)}"/><rect x="529" y="222" width="5" height="62" rx="2" fill="${edge(color)}"/>`
      + cameras + mark;
  },
};

// ------------------------------------------------------------------ laptop

const laptop = {
  front(color, look = {}) {
    const notch = look.notch
      ? `<rect x="372" y="118" width="56" height="15" rx="5" fill="${INK}"/>`
      : `<circle cx="400" cy="124" r="3" fill="#2A2C31"/>`;
    const lines = [236, 200, 260, 150].map((w, i) => `<rect x="262" y="${236 + i * 26}" width="${w}" height="10" rx="5" fill="#CBD5E1"/>`).join('');
    return `<rect x="150" y="110" width="500" height="330" rx="18" fill="${shade(color, -0.1)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="158" y="118" width="484" height="314" rx="12" fill="${INK}"/>`
      + `<rect x="170" y="134" width="460" height="290" rx="4" fill="url(#wall)"/>`
      + `<rect x="232" y="182" width="336" height="196" rx="12" fill="#ffffff" opacity="0.92"/>`
      + `<circle cx="252" cy="202" r="5" fill="#F87171"/><circle cx="268" cy="202" r="5" fill="#FBBF24"/><circle cx="284" cy="202" r="5" fill="#34D399"/>`
      + lines + notch
      + `<polygon points="110,440 690,440 732,470 68,470" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="350" y="440" width="100" height="7" rx="3" fill="${shade(color, -0.18)}"/>`
      + `<rect x="68" y="470" width="664" height="10" rx="5" fill="${shade(color, -0.2)}"/>`;
  },
  back(color, look = {}) {
    const mark = look.notch
      ? `<rect x="370" y="270" width="60" height="60" rx="16" fill="${shade(color, 0.1)}" opacity="0.5"/>`
      : wordmark(look.brandLabel, 400, 318, color, 24);
    return `<rect x="170" y="150" width="460" height="320" rx="22" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="190" y="166" width="420" height="10" rx="5" fill="#ffffff" opacity="0.18"/>`
      + mark
      + `<rect x="170" y="456" width="460" height="16" rx="6" fill="${shade(color, -0.14)}"/>`;
  },
};

// ------------------------------------------------------------------ máy tính bảng

const tablet = {
  front(color) {
    const apps = [];
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        apps.push(`<rect x="${276 + col * 66}" y="${200 + row * 70}" width="48" height="48" rx="13" fill="#ffffff" opacity="${(0.18 + ((row + col) % 3) * 0.08).toFixed(2)}"/>`);
      }
    }
    return `<rect x="230" y="70" width="340" height="540" rx="34" fill="${shade(color, -0.1)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="238" y="78" width="324" height="524" rx="28" fill="${INK}"/>`
      + `<rect x="252" y="92" width="296" height="496" rx="16" fill="url(#wall)"/>`
      + `<text x="276" y="150" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">09:41</text>`
      + apps.join('')
      + `<circle cx="400" cy="85" r="3" fill="#2A2C31"/>`;
  },
  back(color, look = {}) {
    const camera = {
      single: `<rect x="252" y="92" width="64" height="64" rx="18" fill="${shade(color, -0.08)}"/>` + lens(284, 124, 18, color),
      dual: lens(276, 116, 16, color) + lens(276, 164, 16, color),
      square: `<rect x="252" y="92" width="100" height="100" rx="26" fill="${shade(color, -0.08)}"/>` + lens(282, 122, 16, color) + lens(322, 122, 16, color) + flash(282, 162, 6),
      center: `<circle cx="400" cy="138" r="40" fill="${shade(color, -0.1)}" stroke="${shade(color, -0.2)}" stroke-width="2"/>` + lens(400, 138, 20, color),
    }[look.camera || 'single'];
    return `<rect x="230" y="70" width="340" height="540" rx="34" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + camera + wordmark(look.brandLabel, 400, 470, color, 22);
  },
};

// ------------------------------------------------------------------ tai nghe chụp tai

const headphones = {
  front(color) {
    const cup = (cx, cushionCx) => `<ellipse cx="${cx}" cy="460" rx="82" ry="112" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<ellipse cx="${cushionCx}" cy="460" rx="40" ry="98" fill="${shade(color, -0.32)}"/>`
      + `<ellipse cx="${cx - 18}" cy="420" rx="18" ry="34" fill="#ffffff" opacity="0.12"/>`;
    return `<path d="M244 420 C244 150 556 150 556 420" fill="none" stroke="${shade(color, -0.08)}" stroke-width="34" stroke-linecap="round"/>`
      + `<path d="M262 380 C262 190 538 190 538 380" fill="none" stroke="${shade(color, -0.3)}" stroke-width="12" stroke-linecap="round"/>`
      + `<rect x="236" y="330" width="16" height="70" rx="8" fill="${shade(color, -0.2)}"/><rect x="548" y="330" width="16" height="70" rx="8" fill="${shade(color, -0.2)}"/>`
      + cup(244, 290) + cup(556, 510);
  },
  back(color, look = {}) {
    return `<path d="M400 250 C400 110 560 90 610 170" fill="none" stroke="${shade(color, -0.08)}" stroke-width="34" stroke-linecap="round"/>`
      + `<ellipse cx="400" cy="420" rx="150" ry="190" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<ellipse cx="400" cy="420" rx="118" ry="156" fill="none" stroke="${shade(color, -0.12)}" stroke-width="3"/>`
      + `<circle cx="470" cy="300" r="5" fill="${shade(color, -0.35)}"/><circle cx="330" cy="540" r="5" fill="${shade(color, -0.35)}"/>`
      + wordmark(look.brandLabel, 400, 430, color, 26);
  },
};

// ------------------------------------------------------------------ tai nghe không dây + hộp sạc

function bud(cx, color, look) {
  if (look.bud === 'round') {
    return `<ellipse cx="${cx}" cy="330" rx="44" ry="40" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<ellipse cx="${cx}" cy="322" rx="18" ry="14" fill="${shade(color, -0.3)}"/>`;
  }
  return `<rect x="${cx - 13}" y="320" width="26" height="110" rx="13" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
    + `<circle cx="${cx}" cy="316" r="36" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
    + `<ellipse cx="${cx}" cy="306" rx="15" ry="12" fill="${shade(color, -0.3)}"/>`;
}

const earbuds = {
  front(color, look = {}) {
    return `<rect x="262" y="196" width="276" height="170" rx="74" fill="${shade(color, -0.06)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="282" y="214" width="236" height="130" rx="60" fill="${shade(color, -0.16)}"/>`
      + bud(348, color, look) + bud(452, color, look)
      + `<rect x="262" y="380" width="276" height="190" rx="74" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="262" y="380" width="276" height="14" fill="${shade(color, -0.12)}"/>`
      + `<circle cx="400" cy="470" r="5" fill="#57D163"/>`;
  },
  back(color, look = {}) {
    return `<rect x="252" y="230" width="296" height="330" rx="92" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<line x1="256" y1="330" x2="544" y2="330" stroke="${shade(color, -0.16)}" stroke-width="3"/>`
      + `<ellipse cx="350" cy="280" rx="60" ry="22" fill="#ffffff" opacity="0.18"/>`
      + `<circle cx="400" cy="440" r="6" fill="#57D163"/>`
      + wordmark(look.brandLabel, 400, 520, color, 18);
  },
};

// ------------------------------------------------------------------ loa di động

const speaker = {
  front(color, look = {}) {
    return `<path d="M366 152 C366 78 434 78 434 152" fill="none" stroke="${shade(color, -0.28)}" stroke-width="16" stroke-linecap="round"/>`
      + `<rect x="306" y="140" width="188" height="420" rx="94" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="326" y="196" width="148" height="290" rx="74" fill="${shade(color, -0.1)}"/>`
      + `<rect x="326" y="196" width="148" height="290" rx="74" fill="url(#grille)"/>`
      + wordmark(look.brandLabel, 400, 530, color, 18);
  },
  back(color) {
    const buttons = [0, 1, 2, 3].map((i) => `<circle cx="400" cy="${236 + i * 52}" r="16" fill="${shade(color, -0.18)}"/>`).join('');
    return `<path d="M366 152 C366 78 434 78 434 152" fill="none" stroke="${shade(color, -0.28)}" stroke-width="16" stroke-linecap="round"/>`
      + `<rect x="306" y="140" width="188" height="420" rx="94" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + buttons
      + `<rect x="380" y="462" width="40" height="14" rx="7" fill="#1B1C1F"/>`;
  },
};

// ------------------------------------------------------------------ đồng hồ

function watchFace(face) {
  if (face === 'round') {
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return `<line x1="${(400 + Math.sin(a) * 92).toFixed(1)}" y1="${(340 - Math.cos(a) * 92).toFixed(1)}" x2="${(400 + Math.sin(a) * 104).toFixed(1)}" y2="${(340 - Math.cos(a) * 104).toFixed(1)}" stroke="#E5E7EB" stroke-width="${i % 3 === 0 ? 5 : 2}"/>`;
    }).join('');
    return ticks + `<line x1="400" y1="340" x2="452" y2="300" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>`
      + `<line x1="400" y1="340" x2="360" y2="262" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>`
      + `<circle cx="400" cy="340" r="7" fill="#F97316"/>`;
  }
  const ring = (r, c) => `<circle cx="352" cy="282" r="${r}" fill="none" stroke="${c}" stroke-width="7" stroke-dasharray="${(r * 4.4).toFixed(0)} 400" stroke-linecap="round" transform="rotate(-90 352 282)"/>`;
  return ring(30, '#FA114F') + ring(21, '#92E82A') + ring(12, '#1EEAEF')
    + `<text x="400" y="390" text-anchor="middle" font-family="${FONT}" font-size="58" font-weight="700" fill="#ffffff">10:09</text>`
    + `<text x="400" y="420" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#9CA3AF">THỨ NĂM 27</text>`;
}

function watchCase(color, face, fill) {
  if (face === 'round') return `<circle cx="400" cy="340" r="134" fill="${fill}" stroke="${edge(color)}" stroke-width="2"/>`;
  if (face === 'rugged') return `<rect x="276" y="200" width="248" height="280" rx="46" fill="${fill}" stroke="${edge(color)}" stroke-width="2"/>`;
  if (face === 'rect') return `<rect x="294" y="196" width="212" height="288" rx="46" fill="${fill}" stroke="${edge(color)}" stroke-width="2"/>`;
  return `<rect x="288" y="206" width="224" height="268" rx="62" fill="${fill}" stroke="${edge(color)}" stroke-width="2"/>`;
}

function watchScreen(face) {
  if (face === 'round') return `<circle cx="400" cy="340" r="112" fill="${INK}"/>`;
  if (face === 'rugged') return `<rect x="296" y="222" width="208" height="236" rx="30" fill="${INK}"/>`;
  if (face === 'rect') return `<rect x="308" y="210" width="184" height="260" rx="34" fill="${INK}"/>`;
  return `<rect x="302" y="220" width="196" height="240" rx="48" fill="${INK}"/>`;
}

function watchBand(color) {
  const band = shade(color, luminance(color) > 0.6 ? -0.08 : 0.08);
  return `<rect x="328" y="64" width="144" height="190" rx="22" fill="${band}"/>`
    + `<rect x="328" y="426" width="144" height="200" rx="22" fill="${band}"/>`
    + `<circle cx="400" cy="560" r="6" fill="${shade(band, -0.2)}"/><circle cx="400" cy="590" r="6" fill="${shade(band, -0.2)}"/>`;
}

const watch = {
  front(color, look = {}) {
    const face = look.face || 'square';
    const buttons = face === 'round'
      ? `<rect x="530" y="290" width="14" height="40" rx="6" fill="${edge(color)}"/><rect x="530" y="352" width="14" height="40" rx="6" fill="${edge(color)}"/>`
      : `<rect x="${face === 'rugged' ? 522 : 510}" y="282" width="16" height="46" rx="7" fill="${edge(color)}"/>`;
    const action = face === 'rugged' ? `<rect x="266" y="296" width="12" height="64" rx="5" fill="#F26B1D"/>` : '';
    return watchBand(color) + watchCase(color, face, 'url(#body)') + watchScreen(face) + watchFace(face) + buttons + action;
  },
  back(color, look = {}) {
    const face = look.face || 'square';
    const sensors = [0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i * Math.PI) / 3;
      return `<circle cx="${(400 + Math.cos(a) * 34).toFixed(1)}" cy="${(340 + Math.sin(a) * 34).toFixed(1)}" r="6" fill="#4ADE80" opacity="0.85"/>`;
    }).join('');
    return watchBand(color) + watchCase(color, face, 'url(#body)')
      + `<circle cx="400" cy="340" r="84" fill="#1B1D22" stroke="${shade(color, -0.3)}" stroke-width="4"/>`
      + `<circle cx="400" cy="340" r="58" fill="url(#glass)"/>` + sensors
      + wordmark(look.brandLabel, 400, 458, color, 14);
  },
};

// ------------------------------------------------------------------ củ sạc, AirTag, pin dự phòng

const charger = {
  front(color, look = {}) {
    const port = look.port === 'usb-a'
      ? `<rect x="366" y="330" width="68" height="26" rx="4" fill="#2A2B2E"/><rect x="374" y="338" width="52" height="8" rx="2" fill="#5B5E63"/>`
      : `<rect x="374" y="336" width="52" height="18" rx="9" fill="#2A2B2E"/>`;
    return `<polygon points="290,230 510,230 548,198 328,198" fill="${shade(color, 0.04)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<polygon points="510,230 548,198 548,418 510,450" fill="${shade(color, -0.1)}" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="290" y="230" width="220" height="220" rx="28" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + port + wordmark(look.brandLabel, 400, 420, color, 14);
  },
  back(color) {
    return `<rect x="290" y="230" width="220" height="220" rx="28" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="350" y="150" width="18" height="110" rx="4" fill="#C7CBD1" stroke="#9CA3AF" stroke-width="2"/>`
      + `<rect x="432" y="150" width="18" height="110" rx="4" fill="#C7CBD1" stroke="#9CA3AF" stroke-width="2"/>`
      + `<rect x="340" y="252" width="38" height="16" rx="5" fill="${shade(color, -0.16)}"/><rect x="422" y="252" width="38" height="16" rx="5" fill="${shade(color, -0.16)}"/>`;
  },
};

const tracker = {
  front(color) {
    return `<circle cx="400" cy="350" r="160" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<circle cx="400" cy="350" r="132" fill="none" stroke="${shade(color, -0.06)}" stroke-width="3"/>`
      + `<ellipse cx="350" cy="290" rx="60" ry="30" fill="#ffffff" opacity="0.5"/>`;
  },
  back() {
    return `<circle cx="400" cy="350" r="160" fill="url(#steel)" stroke="#8E9399" stroke-width="2"/>`
      + `<circle cx="400" cy="350" r="112" fill="none" stroke="#9DA1A7" stroke-width="3"/>`
      + `<circle cx="400" cy="350" r="42" fill="none" stroke="#B5B9BE" stroke-width="2"/>`;
  },
};

const powerbank = {
  front(color, look = {}) {
    const leds = [0, 1, 2, 3].map((i) => `<circle cx="${370 + i * 20}" cy="500" r="5" fill="${i < 3 ? '#4ADE80' : shade(color, -0.25)}"/>`).join('');
    return `<rect x="282" y="140" width="236" height="440" rx="38" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="300" y="160" width="40" height="400" rx="20" fill="#ffffff" opacity="0.1"/>`
      + wordmark(look.brandLabel, 400, 360, color, 22) + leds;
  },
  back(color) {
    return `<rect x="200" y="290" width="400" height="150" rx="44" fill="url(#body)" stroke="${edge(color)}" stroke-width="2"/>`
      + `<rect x="270" y="352" width="46" height="18" rx="9" fill="#1B1C1F"/>`
      + `<rect x="348" y="348" width="62" height="26" rx="4" fill="#1B1C1F"/><rect x="430" y="348" width="62" height="26" rx="4" fill="#1B1C1F"/>`
      + `<circle cx="528" cy="361" r="6" fill="#4ADE80"/>`;
  },
};

export const DEVICES = { phone, laptop, tablet, headphones, earbuds, speaker, watch, charger, tracker, powerbank };
