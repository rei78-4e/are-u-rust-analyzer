// 全問題を実際の rustc でコンパイルし、answer と一致するか検証する。
// 結果 (エラーメッセージ・終了コード・実行した引数を含む) は questions/verified.json に
// 保存され、build で使われる。全問成功したときだけ書き換える。
//
//   npm run verify                 # 全問題
//   npm run verify -- basic/001    # id の部分一致で絞り込み
//   RUST_TOOLCHAIN=1.99.1 npm run verify
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir, availableParallelism } from "node:os";
import { join } from "node:path";
import { loadQuestions, loadVerified, VERIFIED_PATH } from "./lib.mjs";

const TOOLCHAIN = process.env.RUST_TOOLCHAIN ?? "1.99.1";
const filter = process.argv[2];

const version = execFileSync("rustc", [`+${TOOLCHAIN}`, "--version"], { encoding: "utf8" }).trim();
console.log(`using ${version}\n`);

const work = mkdtempSync(join(tmpdir(), "aura-"));

function run(cmd, args, cwd) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d));
    p.on("close", (status) => resolve({ status, stderr }));
  });
}

// サイトに表示するコマンド (`rustc +<toolchain> --edition <edition> main.rs`) をそのまま実行し、
// 出力を表示用に保存する。パスが main.rs になるよう問題ごとのディレクトリで実行する。
async function compile(q) {
  const dir = join(work, q.id.replace("/", "_"));
  mkdirSync(dir);
  writeFileSync(join(dir, "main.rs"), q.code);
  const args = [`+${TOOLCHAIN}`, "--edition", q.edition, "main.rs"];
  const r = await run("rustc", args, dir);
  const first = r.stderr.match(/^error(?:\[E\d+\])?: .*$/m);
  return {
    compiles: r.status === 0,
    status: r.status,
    error: first ? first[0] : null,
    output: r.stderr,
    toolchain: version,
    args,
  };
}

const all = loadQuestions();
const questions = all.filter((q) => !filter || q.id.includes(filter));
if (questions.length === 0) {
  console.error(`error: "${filter}" に一致する問題がありません`);
  process.exit(1);
}

const verified = loadVerified();

let failed = 0;
const queue = [...questions];
async function worker() {
  for (let q; (q = queue.shift()); ) {
    const res = await compile(q);
    const actual = res.compiles ? "ok" : "error";
    const pass = actual === q.answer;
    if (!pass) failed++;
    console.log(`${pass ? "✓" : "✗"} ${q.id.padEnd(40)} expect=${q.answer.padEnd(5)} actual=${actual}${res.error ? `  ${res.error}` : ""}`);
    if (!pass && res.output) console.log(res.output);
    verified.results[q.id] = { hash: q.hash, ...res };
  }
}
await Promise.all(Array.from({ length: Math.min(availableParallelism(), 8) }, worker));
rmSync(work, { recursive: true, force: true });

if (failed) {
  console.error(`\n${failed}/${questions.length} 問が不一致のため ${VERIFIED_PATH} は更新していません`);
  process.exit(1);
}

// 削除された問題の結果を掃除
const ids = new Set(all.map((q) => q.id));
for (const id of Object.keys(verified.results)) if (!ids.has(id)) delete verified.results[id];

// 古い形式 (toolchain / args なし) が残っていないか確認
const legacy = Object.entries(verified.results).filter(
  ([, r]) => typeof r.toolchain !== "string" || !Array.isArray(r.args),
);
if (legacy.length) {
  console.error(
    `\nerror: toolchain / args が記録されていない古い検証結果が ${legacy.length} 件あります。` +
      ` 全問を検証し直してください (npm run verify)`,
  );
  process.exit(1);
}

// 異なる toolchain の結果が混ざったまま保存しない
const toolchains = [...new Set(Object.values(verified.results).map((r) => r.toolchain))].sort();
if (toolchains.length > 1) {
  console.error(
    `\nerror: verified.json に複数の toolchain が混在しています: ${toolchains.join(", ")}\n` +
      ` 同じ toolchain で全問を検証し直してください (RUST_TOOLCHAIN=... npm run verify)`,
  );
  process.exit(1);
}
verified.toolchain = toolchains[0] ?? null;

verified.results = Object.fromEntries(Object.entries(verified.results).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(VERIFIED_PATH, JSON.stringify(verified, null, 2) + "\n");

console.log(`\n${questions.length}/${questions.length} passed`);
