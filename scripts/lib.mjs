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
