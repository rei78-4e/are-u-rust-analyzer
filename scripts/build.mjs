// questions/**/*.rs と questions/verified.json から public/questions.json を生成する。
// rustc が無い環境 (Cloudflare のビルド環境など) でも動くよう、コンパイルはしない。
// 代わりに、保存された検証結果が自己矛盾していないかを厳密に検査する。
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadQuestions, loadVerified, resultProblems } from "./lib.mjs";

const questions = loadQuestions();
const verified = loadVerified();

let errors = 0;
let unverified = 0;
const toolchains = new Set();

const out = questions.map((q) => {
  const base = {
    id: q.id,
    level: q.level,
    topic: q.topic,
    answer: q.answer,
    edition: q.edition,
    code: q.code,
    explain: q.explain,
  };

  const v = verified.results[q.id];
  if (!v || v.hash !== q.hash) {
    unverified++;
    console.warn(`warn: ${q.id} は未検証です (npm run verify を実行してください)`);
    return { ...base, verified: false, output: null, status: null, args: null };
  }

  if (typeof v.toolchain === "string" && v.toolchain !== "") toolchains.add(v.toolchain);

  const problems = resultProblems(q, v);
  if ((v.compiles ? "ok" : "error") !== q.answer) {
    problems.unshift(`answer=${q.answer} が rustc の結果 (${v.compiles ? "ok" : "error"}) と一致しません`);
  }
  if (problems.length) {
    errors++;
    for (const p of problems) console.error(`error: ${q.id}: ${p}`);
    return { ...base, verified: false, output: null, status: null, args: null };
  }

  return {
    ...base,
    // 実際の rustc の stderr・終了コード・実行引数
    verified: true,
    output: v.output,
    status: v.status,
    args: v.args,
  };
});

// 検証結果全体で toolchain が 1 つに揃っていることを確認
if (toolchains.size > 1) {
  errors++;
  console.error(`error: verified.json に複数の toolchain が混在しています: ${[...toolchains].join(", ")}`);
} else if (toolchains.size === 1) {
  const [toolchain] = toolchains;
  if (verified.toolchain !== toolchain) {
    errors++;
    console.error(
      `error: verified.json の toolchain (${verified.toolchain ?? "未設定"}) が` +
        ` 各結果の toolchain (${toolchain}) と一致しません`,
    );
  }
}

if (errors) process.exit(1);

const count = (level) => out.filter((q) => q.level === level).length;
writeFileSync(
  join(ROOT, "public", "questions.json"),
  JSON.stringify({ toolchain: verified.toolchain ?? null, questions: out }),
);
console.log(
  `public/questions.json: ${out.length} 問 (basic ${count("basic")}, advanced ${count("advanced")})` +
    (unverified ? `, 未検証 ${unverified}` : ""),
);
