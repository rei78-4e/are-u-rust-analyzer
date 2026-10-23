// 全問題を実際の rustc でコンパイルし、answer と一致するか検証する。
// 結果 (エラーメッセージ含む) は questions/verified.json に保存され、build で使われる。
//
//   npm run verify                 # 全問題
//   npm run verify -- basic/001    # id の部分一致で絞り込み
//   RUST_TOOLCHAIN=1.99.1 npm run verify
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir, availableParallelism } from "node:os";
import { join } from "node:path";
import { loadQuestions, loadVerified, VERIFIED_PATH } from "./lib.mjs";

const TOOLCHAIN = process.env.RUST_TOOLCHAIN ?? "1.99.1";
const filter = process.argv[2];

const version = execFileSync("rustc", [`+${TOOLCHAIN}`, "--version"], { encoding: "utf8" }).trim();
console.log(`using ${version}\n`);

const work = mkdtempSync(join(tmpdir(), "aura-"));

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args);
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d));
    p.on("close", (status) => resolve({ status, stderr }));
  });
}

async function compile(q) {
  const base = join(work, q.id.replace("/", "_"));
  writeFileSync(`${base}.rs`, q.code);
  const r = await run("rustc", [
    `+${TOOLCHAIN}`, "--edition", q.edition, "--crate-type", "bin", "--crate-name", "q",
    "--error-format", "json", "-o", `${base}.out`, `${base}.rs`,
  ]);
  const errors = r.stderr
    .split("\n")
    .filter((l) => l.startsWith("{"))
    .map((l) => JSON.parse(l))
    .filter((d) => d.level === "error" && !/^aborting due to/.test(d.message));
  const first = errors[0];
  return {
    compiles: r.status === 0,
    error: first ? `error${first.code ? `[${first.code.code}]` : ""}: ${first.message}` : null,
    rendered: first?.rendered ?? null,
  };
}

const questions = loadQuestions().filter((q) => !filter || q.id.includes(filter));
const verified = loadVerified();
verified.toolchain = version;

let failed = 0;
const queue = [...questions];
async function worker() {
  for (let q; (q = queue.shift()); ) {
    const res = await compile(q);
    const actual = res.compiles ? "ok" : "error";
    const pass = actual === q.answer;
    if (!pass) failed++;
    console.log(`${pass ? "✓" : "✗"} ${q.id.padEnd(40)} expect=${q.answer.padEnd(5)} actual=${actual}${res.error ? `  ${res.error}` : ""}`);
    if (!pass && res.rendered) console.log(res.rendered);
    verified.results[q.id] = { hash: q.hash, compiles: res.compiles, error: res.error };
  }
}
await Promise.all(Array.from({ length: Math.min(availableParallelism(), 8) }, worker));
rmSync(work, { recursive: true, force: true });

// 削除された問題の結果を掃除
const ids = new Set(loadQuestions().map((q) => q.id));
for (const id of Object.keys(verified.results)) if (!ids.has(id)) delete verified.results[id];
verified.results = Object.fromEntries(Object.entries(verified.results).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(VERIFIED_PATH, JSON.stringify(verified, null, 2) + "\n");

console.log(`\n${questions.length - failed}/${questions.length} passed`);
process.exit(failed ? 1 : 0);
