// コードと rustc の出力を HTML に変換する純粋関数。
// DOM に依存しないので、scripts/test-render.mjs から直接 import してテストできる。
"use strict";

export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// 解説文: `code` をインラインコードに、改行を <br> に
export function renderText(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

// ---------- tiny Rust highlighter ----------

const KEYWORDS = new Set(
  ("as async await break const continue crate dyn else enum extern false fn for gen if impl in let loop " +
   "match mod move mut pub ref return self Self static struct super trait true type union unsafe use where while")
    .split(" "),
);
const PRIMITIVES = new Set(
  "i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str".split(" "),
);

const TOKEN = new RegExp(
  [
    String.raw`(?<cmt>\/\/[^\n]*)`,
    String.raw`(?<attr>#!?\[[^\]\n]*\])`,
    String.raw`(?<raw>[bc]?r(?<h>#*)"[\s\S]*?"\k<h>)`,
    String.raw`(?<str>[bc]?"(?:\\[\s\S]|[^"\\])*")`,
    String.raw`(?<chr>b?'(?:\\.|[^'\\])')`,
    String.raw`(?<lt>'[A-Za-z_]\w*)`,
    String.raw`(?<mac>[A-Za-z_]\w*!(?!=))`,
    String.raw`(?<num>\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?(?:_?[iuf](?:8|16|32|64|128|size))?\b)`,
    String.raw`(?<ident>\b(?:r#)?[A-Za-z_]\w*\b)`,
  ].join("|"),
  "g",
);

export function highlight(code) {
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += escapeHtml(code.slice(last, m.index));
    last = m.index + m[0].length;
    const g = m.groups;
    const text = escapeHtml(m[0]);
    let cls = null;
    if (g.cmt) cls = "cmt";
    else if (g.attr) cls = "attr";
    else if (g.raw || g.str || g.chr) cls = "str";
    else if (g.lt) cls = "lt";
    else if (g.mac) cls = "mac";
    else if (g.num) cls = "num";
    else if (g.ident) {
      const id = g.ident;
      if (KEYWORDS.has(id)) cls = "kw";
      else if (PRIMITIVES.has(id) || /^[A-Z]/.test(id)) cls = "ty";
      else if (code[last] === "(" || code.startsWith("::<", last)) cls = "fn";
    }
    out += cls ? `<span class="hl-${cls}">${text}</span>` : text;
  }
  out += escapeHtml(code.slice(last));
  // 行番号用に 1 行ずつ包む (span が行をまたぐことはない: 複数行のトークンは raw string のみで、問題では使わない)
  return out
    .replace(/\n$/, "")
    .split("\n")
    .map((l) => `<span class="line">${l}</span>`)
    .join("");
}

export function editorHtml(code) {
  return `<div class="editor"><pre class="code"><code>${highlight(code)}</code></pre></div>`;
}

export function terminalHtml(q) {
  const prompt = (cmd) => `<span class="prompt">$</span> ${escapeHtml(cmd)}\n`;
  // 検証時に実際に実行した引数をそのまま表示する
  const args = q.args ?? [];
  const status = q.status;
  return prompt(`rustc ${args.join(" ")}`) +
    rustcOutputHtml(q.output ?? "") +
    prompt("echo $?") +
    `<span class="${status === 0 ? "t-ok" : "t-err"}">${status}</span>`;
}

// rustc がターミナルで付ける色を再現する
export function rustcOutputHtml(out) {
  const span = (cls, s) => `<span class="${cls}">${escapeHtml(s)}</span>`;
  return out
    .split("\n")
    .map((line) => {
      let m;
      // error[E0382]: ... / warning: ... / help: ... / note: ...
      if ((m = line.match(/^(error(?:\[E\d+\])?|warning(?:\[[^\]]+\])?|help|note)(:.*)$/))) {
        const kind = m[1].startsWith("error") ? "t-err" : m[1].startsWith("warning") ? "t-warn" : "t-help";
        return span(`${kind} t-b`, m[1]) + (kind === "t-help" ? escapeHtml(m[2]) : span("t-b", m[2]));
      }
      // " --> main.rs:4:16"
      if ((m = line.match(/^(\s*-->)(.*)$/))) return span("t-gutter", m[1]) + escapeHtml(m[2]);
      // "4 |     code" / "  |     ^ label" / "  = note: ..."
      if ((m = line.match(/^(\s*\d*\s*[|=])(.*)$/))) {
        const [, gutter, rest] = m;
        // 行番号付きの行はソースコードそのものなので色を付けない
        if (/\d/.test(gutter)) return span("t-gutter", gutter) + escapeHtml(rest);
        const body = escapeHtml(rest)
          .replace(/\^+/g, (x) => `<span class="t-err t-b">${x}</span>`)
          .replace(/^(\s*)(-+|\++)(?=\s|$)/, (_, sp, x) => `${sp}<span class="${x[0] === "+" ? "t-ok" : "t-gutter"} t-b">${x}</span>`);
        return span("t-gutter", gutter) + body;
      }
      return escapeHtml(line);
    })
    .join("\n")
    .replace(/\n+$/, "\n");
}
