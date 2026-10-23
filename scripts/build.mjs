// questions/**/*.rs と questions/verified.json から public/questions.json を生成する。
// rustc が無い環境 (Cloudflare のビルド環境など) でも動くよう、コンパイルはしない。
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadQuestions, loadVerified } from "./lib.mjs";

const questions = loadQuestions();
const verified = loadVerified();

let errors = 0;
let unverified = 0;
const out = questions.map((q) => {
  const v = verified.results[q.id];
  if (!v || v.hash !== q.hash) {
    unverified++;
    console.warn(`warn: ${q.id} は未検証です (npm run verify を実行してください)`);
  } else if ((v.compiles ? "ok" : "error") !== q.answer) {
    errors++;
    console.error(`error: ${q.id} の answer=${q.answer} が rustc の結果と一致しません`);
  }
  return {
    id: q.id,
    level: q.level,
    topic: q.topic,
    answer: q.answer,
    edition: q.edition,
    code: q.code,
    explain: q.explain,
    rustc: v?.hash === q.hash ? v.error : null,
  };
});

if (errors) process.exit(1);

const count = (level) => out.filter((q) => q.level === level).length;
writeFileSync(
  join(ROOT, "public", "questions.json"),
  JSON.stringify({ toolchain: verified.toolchain, questions: out }),
);
console.log(
  `public/questions.json: ${out.length} 問 (basic ${count("basic")}, advanced ${count("advanced")})` +
    (unverified ? `, 未検証 ${unverified}` : ""),
);
