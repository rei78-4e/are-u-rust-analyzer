// スコアごとの称号。app.js (結果画面)・scripts/og.mjs (OG 画像)・src/worker.js (OG メタタグ) で共有する。
"use strict";

export const TOTAL = 10;

export const RANKS = [
  { min: 10, title: "あなたは rust-analyzer です", comment: "赤い波線を引く側の存在。もう IDE はいりません。" },
  { min: 8, title: "あなたは rustc です", comment: "ほぼコンパイラ。エラーメッセージまで脳内で出力できそう。" },
  { min: 6, title: "あなたは clippy です", comment: "だいたい分かっている。ついでに余計な指摘もしたくなる。" },
  { min: 4, title: "あなたは cargo check 常用者です", comment: "保存するたびに IDE の赤線を確認するタイプ。" },
  { min: 2, title: "あなたは借用チェッカーと喧嘩中です", comment: "とりあえず .clone() を付ければ通ると信じている。" },
  { min: 0, title: "あなたは C++ コンパイラです", comment: "なんでも通しそう。実行時に会いましょう。" },
];

export const rankFor = (score) => RANKS.find((r) => score >= r.min);
