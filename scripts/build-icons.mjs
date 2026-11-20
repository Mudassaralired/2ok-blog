// Generates PNG & ICO favicons matching public/favicon.svg at build time
// (runs in `prebuild`) so Google Search, iOS, and browsers get crisp
// 48px/96px/192px PNGs and /favicon.ico without committing binary files.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");

// Brand colors from app/globals.css: clay (#b4653a) and cream (#faf6f0).
const BG = [180, 101, 58, 255];
const FG = [250, 246, 240, 255];
const TRANSPARENT = [0, 0, 0, 0];

// House silhouette polygon in 64x64 viewBox (mirrors public/favicon.svg).
const HOUSE_POLY = [
  [32, 14],
  [50, 30],
  [45, 30],
  [45, 48],
  [37, 48],
  [37, 38],
  [27, 38],
  [27, 48],
  [19, 48],
  [19, 30],
  [14, 30],
];

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInRoundedRect(x, y, size, r) {
  if (x < 0 || y < 0 || x > size || y > size) return false;
  const cx = x < r ? r : x > size - r ? size - r : x;
  const cy = y < r ? r : y > size - r ? size - r : y;
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function sampleColor(u, v, opaqueSquare) {
  // u, v in 0..64 coordinate space
  if (!opaqueSquare && !pointInRoundedRect(u, v, 64, 14)) {
    return TRANSPARENT;
  }
  const dx = u - 32;
  const dy = v - 24;
  if (dx * dx + dy * dy <= 3.2 * 3.2) {
    return BG;
  }
  if (pointInPoly(u, v, HOUSE_POLY)) {
    return FG;
  }
  return BG;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function renderPng(size, opaqueSquare = false) {
  const samples = 4; // 4x4 supersampling for smooth anti-aliased edges
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);

  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // PNG filter type 0 (None)
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const u = ((x + (sx + 0.5) / samples) / size) * 64;
          const v = ((y + (sy + 0.5) / samples) / size) * 64;
          const [cr, cg, cb, ca] = sampleColor(u, v, opaqueSquare);
          const alpha = ca / 255;
          r += cr * alpha;
          g += cg * alpha;
          b += cb * alpha;
          a += ca;
        }
      }
      const n = samples * samples;
      const outA = Math.round(a / n);
      const off = y * stride + 1 + x * 4;
      if (outA > 0) {
        const aNorm = a / 255;
        raw[off] = Math.round(r / aNorm);
        raw[off + 1] = Math.round(g / aNorm);
        raw[off + 2] = Math.round(b / aNorm);
        raw[off + 3] = outA;
      } else {
        raw[off] = 0;
        raw[off + 1] = 0;
        raw[off + 2] = 0;
        raw[off + 3] = 0;
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function buildIco(entries) {
  // Multi-size ICO container embedding PNG frames (supported by all modern browsers & Googlebot).
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  for (let i = 0; i < entries.length; i++) {
    const { size, png } = entries[i];
    const base = i * 16;
    dir[base] = size >= 256 ? 0 : size;
    dir[base + 1] = size >= 256 ? 0 : size;
    dir[base + 2] = 0;
    dir[base + 3] = 0;
    dir.writeUInt16LE(1, base + 4); // planes
    dir.writeUInt16LE(32, base + 6); // bpp
    dir.writeUInt32LE(png.length, base + 8);
    dir.writeUInt32LE(offset, base + 12);
    offset += png.length;
  }
  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

const p16 = renderPng(16);
const p32 = renderPng(32);
const p48 = renderPng(48);
const p96 = renderPng(96);
const p180 = renderPng(180, true); // Apple touch icon prefers opaque square background
const p192 = renderPng(192);

fs.mkdirSync(pub, { recursive: true });
fs.writeFileSync(path.join(pub, "icon-48.png"), p48);
fs.writeFileSync(path.join(pub, "icon-96.png"), p96);
fs.writeFileSync(path.join(pub, "icon-192.png"), p192);
fs.writeFileSync(path.join(pub, "apple-touch-icon.png"), p180);
fs.writeFileSync(
  path.join(pub, "favicon.ico"),
  buildIco([
    { size: 48, png: p48 },
    { size: 32, png: p32 },
    { size: 16, png: p16 },
  ])
);
console.log("icons: generated favicon.ico, icon-48/96/192.png, apple-touch-icon.png");
