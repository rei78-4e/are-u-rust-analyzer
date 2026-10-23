// 描画関数が入力を壊さず HTML 化できるか (round-trip) を確認する。
// 実際の rustc 出力と全問題のコードを入力に使う。
import { loadQuestions, loadVerified } from "./lib.mjs";
import { editorHtml, escapeHtml, highlight, renderText, rustcOutputHtml, terminalHtml } from "../public/render.js";

let failed = 0;
let checks = 0;
function check(name, cond, detail = "") {
  checks++;
  if (cond) return;
  failed++;
  console.error(`✗ ${name}${detail ? `\n  ${detail}` : ""}`);
}

function decode(s) {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

// ハイライト結果の <span class="line"> 境界を改行に戻してタグを除去する
function stripLines(html) {
  return html
    .split('<span class="line">')
    .slice(1)
    .map((chunk) => decode(chunk.replace(/<[^>]*>/g, "")))
    .join("\n");
}

function strip(html) {
  return decode(html.replace(/<[^>]*>/g, ""));
}

const normalize = (s) => s.replace(/\n+$/, "\n");

const questions = loadQuestions();
for (const q of questions) {
  const expected = q.code.replace(/\n$/, "");
  check(`highlight round-trip: ${q.id}`, stripLines(highlight(q.code)) === expected);
  check(`editorHtml round-trip: ${q.id}`, stripLines(editorHtml(q.code)) === expected);
}

const verified = loadVerified();
let outputs = 0;
for (const q of questions) {
  const v = verified.results[q.id];
  if (!v || v.hash !== q.hash) continue;
  outputs++;
  const expected = normalize(v.output);
  const actual = normalize(strip(rustcOutputHtml(v.output)));
  check(`rustcOutputHtml round-trip: ${q.id}`, actual === expected);
}
check("verified な rustc 出力が 1 件以上ある", outputs > 0);

const evil = '<img src=x onerror="alert(1)"> & <script>alert(1)</script>';
check("rustcOutputHtml が HTML をエスケープする", !rustcOutputHtml(evil).includes("<img") && !rustcOutputHtml(evil).includes("<script"));
check("renderText が HTML をエスケープする", !renderText(evil).includes("<script"));
check("escapeHtml が引用符もエスケープする", escapeHtml(`"'&<>`) === "&quot;&#39;&amp;&lt;&gt;");
check("renderText がインラインコードと改行を変換する", renderText("`a`\nb") === "<code>a</code><br>b");

const base = {
  answer: "ok",
  args: ["+1.99.1", "--edition", "2024", "main.rs"],
  output: "error[E0382]: borrow of moved value: `s`\n",
  status: 1,
};
const err = terminalHtml(base);
check("terminal が実行引数をそのまま表示する", err.includes("rustc +1.99.1 --edition 2024 main.rs"));
check("terminal が echo $? を表示する", err.includes("echo $?"));
check("terminal が記録された status を表示する", err.includes('<span class="t-err">1</span>'));
check("terminal が answer から status を捏造しない", !err.includes('<span class="t-ok">0</span>'));
check("terminal が成功時の status 0 を表示する", terminalHtml({ ...base, answer: "error", status: 0, output: "" }).includes('<span class="t-ok">0</span>'));
check(
  "terminal が引数をエスケープする",
  !terminalHtml({ ...base, args: ['+x" onmouseover="x', "--edition", "2024", "main.rs"], status: 0, output: "" }).includes('onmouseover="x"'),
);

console.log(`render tests: ${checks - failed}/${checks} passed (${questions.length} codes, ${outputs} rustc outputs)`);
process.exit(failed ? 1 : 0);
