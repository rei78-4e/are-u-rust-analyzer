// シェア用の OG 画像 (1200x630) を public/og/ に生成する。
//   public/og/default.png  トップページ用
//   public/og/<n>.png      スコア n (0..10) のシェアリンク (/?s=n) 用
// フォントはシステムのものを使う。Noto Sans JP (ウェイト別の静的フォント) と Monaspace Radon を推奨。
// 可変フォントの Noto Sans CJK JP では太字が効かないので、Noto Sans JP を優先している。
// 生成した PNG はリポジトリにコミットする。称号やデザインを変えたら npm run og で再生成すること。
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { RANKS, TOTAL, rankFor } from "../public/ranks.js";
import { escapeHtml } from "../public/render.js";
import { ROOT } from "./lib.mjs";

const W = 1200;
const H = 630;
const C = {
  bg: "#1b1b1f",
  panel: "#232328",
  border: "#3a3a42",
  text: "#e8e6e3",
  muted: "#9a98a0",
  rust: "#f74c00",
  rustSoft: "#ff8a4c",
  err: "#ff5d5d",
};
const SANS = "Noto Sans JP, Noto Sans CJK JP, sans-serif";
const MONO = "Monaspace Radon, Noto Sans Mono, monospace";

// rust-analyzer の赤い波線
function squiggle(x, y, width, color) {
  const step = 12;
  let d = `M${x} ${y}`;
  for (let i = 0; i * step < width; i++) d += ` q${step / 2} ${i % 2 ? 6 : -6} ${step} 0`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
}

function frame(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><clipPath id="win"><rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="24"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="24" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <circle cx="84" cy="84" r="9" fill="#ff5f57"/>
  <circle cx="114" cy="84" r="9" fill="#febc2e"/>
  <circle cx="144" cy="84" r="9" fill="#28c840"/>
  <text x="${W - 84}" y="93" text-anchor="end" font-family="${MONO}" font-size="26" fill="${C.muted}">main.rs</text>
  ${body}
  <rect x="40" y="${H - 52}" width="${W - 80}" height="12" fill="${C.rust}" clip-path="url(#win)"/>
</svg>`;
}

function defaultSvg() {
  return frame(`
  <text x="100" y="270" font-family="${MONO}" font-size="76" font-weight="800" fill="${C.text}">Are you <tspan fill="${C.rust}">rust-analyzer</tspan>?</text>
  ${squiggle(466, 296, 612, C.err)}
  <text x="100" y="400" font-family="${SANS}" font-size="48" font-weight="800" fill="${C.text}">そのコード、コンパイル通る？</text>
  <text x="100" y="470" font-family="${SANS}" font-size="32" font-weight="500" fill="${C.muted}">Rust のコードがコンパイルできるかを考える ${TOTAL} 問クイズ</text>`);
}

function scoreSvg(score) {
  const rank = rankFor(score);
  return frame(`
  <text x="100" y="170" font-family="${MONO}" font-size="40" font-weight="700" fill="${C.muted}">Are you <tspan fill="${C.rust}">rust-analyzer</tspan>?</text>
  <text x="100" y="360" font-family="${MONO}" font-size="180" font-weight="800" fill="${C.rustSoft}">${score}<tspan font-size="80" fill="${C.muted}">/${TOTAL}</tspan></text>
  <text x="100" y="455" font-family="${SANS}" font-size="56" font-weight="800" fill="${C.text}">${escapeHtml(rank.title)}</text>
  <text x="100" y="515" font-family="${SANS}" font-size="30" font-weight="500" fill="${C.muted}">${escapeHtml(rank.comment)}</text>`);
}

function render(svg) {
  return new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: { loadSystemFonts: true, defaultFontFamily: "Noto Sans JP" },
  })
    .render()
    .asPng();
}

if (RANKS.at(-1).min !== 0) throw new Error("RANKS must cover score 0");

const dir = join(ROOT, "public", "og");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "default.png"), render(defaultSvg()));
for (let s = 0; s <= TOTAL; s++) writeFileSync(join(dir, `${s}.png`), render(scoreSvg(s)));
console.log(`public/og/: default.png + ${TOTAL + 1} 枚`);
