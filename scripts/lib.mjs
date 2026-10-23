// 問題ファイル (questions/<level>/*.rs) の読み込みとパース。
import { readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, basename } from "node:path";

export const ROOT = new URL("..", import.meta.url).pathname;
export const QUESTIONS_DIR = join(ROOT, "questions");
export const LEVELS = ["basic", "advanced"];
export const VERIFIED_PATH = join(QUESTIONS_DIR, "verified.json");

const ANSWERS = new Set(["ok", "error"]);
const EDITIONS = new Set(["2015", "2018", "2021", "2024"]);

// ファイル先頭の
//   // ---
//   // key: value
//   // ---
// ブロックをメタデータとして読み、残りをコードとして返す。
export function parseQuestion(path, level) {
  const src = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const lines = src.split("\n");
  if (lines[0].trim() !== "// ---") {
    throw new Error(`${path}: 先頭行は "// ---" である必要があります`);
  }
  const end = lines.indexOf("// ---", 1);
  if (end < 0) throw new Error(`${path}: 閉じる "// ---" がありません`);

  const meta = {};
  let lastKey = null;
  for (const raw of lines.slice(1, end)) {
    const line = raw.replace(/^\/\/ ?/, "");
    const m = line.match(/^([a-z_]+):\s?(.*)$/);
    if (m) {
      lastKey = m[1];
      meta[lastKey] = m[2];
    } else if (lastKey) {
      // キーのない行は直前のキーの続き (改行は保持)
      meta[lastKey] += "\n" + line.trim();
    }
  }

  const code = lines.slice(end + 1).join("\n").replace(/^\n+/, "").replace(/\s+$/, "") + "\n";
  const id = `${level}/${basename(path, ".rs")}`;
  const answer = meta.answer?.trim();
  const edition = (meta.edition ?? "2024").trim();

  if (!ANSWERS.has(answer)) throw new Error(`${path}: answer は ok か error`);
  if (!EDITIONS.has(edition)) throw new Error(`${path}: 不明な edition ${edition}`);
  if (!meta.explain) throw new Error(`${path}: explain がありません`);

  return {
    id,
    level,
    topic: (meta.topic ?? "").trim(),
    answer,
    edition,
    explain: meta.explain.trim(),
    code,
    hash: createHash("sha256").update(`${edition}\n${code}`).digest("hex").slice(0, 16),
    path,
  };
}

export function loadQuestions() {
  const all = [];
  for (const level of LEVELS) {
    const dir = join(QUESTIONS_DIR, level);
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".rs")).sort()) {
      all.push(parseQuestion(join(dir, f), level));
    }
  }
  return all;
}

export function loadVerified() {
  try {
    return JSON.parse(readFileSync(VERIFIED_PATH, "utf8"));
  } catch {
    return { toolchain: null, results: {} };
  }
}

// 保存された検証結果が「rustc の実行結果」として自己矛盾していないか検査する。
// 問題コードとの hash 一致は呼び出し側で確認する前提。
export function resultProblems(q, r) {
  const problems = [];
  if (!r || typeof r !== "object") return ["検証結果がありません"];

  if (typeof r.compiles !== "boolean") problems.push("compiles が真偽値ではありません");
  if (!Number.isInteger(r.status)) problems.push("status が整数ではありません");
  else if (typeof r.compiles === "boolean" && (r.status === 0) !== r.compiles) {
    problems.push(`status=${r.status} と compiles=${r.compiles} が矛盾しています`);
  }

  if (typeof r.output !== "string") problems.push("output が文字列ではありません");
  if (typeof r.toolchain !== "string" || r.toolchain === "") {
    problems.push("toolchain が記録されていません");
  }

  const args = r.args;
  const argsOk =
    Array.isArray(args) &&
    args.length === 4 &&
    typeof args[0] === "string" &&
    args[0].startsWith("+") &&
    args[1] === "--edition" &&
    args[2] === q.edition &&
    args[3] === "main.rs";
  if (!argsOk) problems.push(`args が実行内容と一致しません: ${JSON.stringify(args)}`);

  const errorLine = /^error(?:\[[^\]]+\])?: /m;
  if (r.compiles === true) {
    if (r.error != null) problems.push("コンパイル成功なのに error が記録されています");
    if (typeof r.output === "string" && errorLine.test(r.output)) {
      problems.push("コンパイル成功なのに output に error 行があります");
    }
  } else if (r.compiles === false) {
    if (typeof r.error !== "string" || !/^error(?:\[[^\]]+\])?: /.test(r.error)) {
      problems.push("エラー終了なのに error がエラー行ではありません");
    }
    if (typeof r.output === "string" && !errorLine.test(r.output)) {
      problems.push("エラー終了なのに output に error 行がありません");
    }
  }

  return problems;
}
