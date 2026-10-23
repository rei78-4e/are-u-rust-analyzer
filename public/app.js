"use strict";

import { editorHtml, escapeHtml, highlight, renderText, terminalHtml } from "./render.js";

// 1 回のテストで出す問題数
const PICK = { basic: 3, advanced: 7 };
const TOTAL = PICK.basic + PICK.advanced;

const RANKS = [
  { min: 10, title: "あなたは rust-analyzer です", comment: "赤い波線を引く側の存在。もう IDE はいりません。" },
  { min: 8, title: "あなたは rustc です", comment: "ほぼコンパイラ。エラーメッセージまで脳内で出力できそう。" },
  { min: 6, title: "あなたは clippy です", comment: "だいたい分かっている。ついでに余計な指摘もしたくなる。" },
  { min: 4, title: "あなたは cargo check 常用者です", comment: "保存するたびに IDE の赤線を確認するタイプ。" },
  { min: 2, title: "あなたは借用チェッカーと喧嘩中です", comment: "とりあえず .clone() を付ければ通ると信じている。" },
  { min: 0, title: "あなたは C++ コンパイラです", comment: "なんでも通しそう。実行時に会いましょう。" },
];

const $ = (id) => document.getElementById(id);
const state = { all: [], quiz: [], index: 0, answers: [], toolchain: "1.99.1" };

// ---------- utilities ----------

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function show(screen) {
  for (const id of ["screen-start", "screen-quiz", "screen-result"]) $(id).hidden = id !== screen;
  window.scrollTo({ top: 0 });
}

// ---------- quiz flow ----------

function startQuiz() {
  const by = (level) => shuffle(state.all.filter((q) => q.level === level)).slice(0, PICK[level]);
  state.quiz = [...by("basic"), ...by("advanced")];
  state.index = 0;
  state.answers = [];
  show("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.quiz[state.index];
  $("progress-bar").style.width = `${(state.index / TOTAL) * 100}%`;
  $("q-num").textContent = `Q${state.index + 1}/${TOTAL}`;
  $("q-level").textContent = q.level === "basic" ? "基礎" : "応用";
  $("q-level").className = `chip level-${q.level}`;
  $("q-topic").textContent = q.topic;
  $("q-edition").textContent = `edition ${q.edition}`;
  $("q-code").innerHTML = highlight(q.code);
  for (const b of document.querySelectorAll(".choice")) {
    b.disabled = false;
    b.classList.remove("picked");
  }
  $("feedback").hidden = true;
  $("terminal").hidden = true;
  $("unverified").hidden = true;
}

function answer(choice) {
  if (!$("feedback").hidden) return;
  const q = state.quiz[state.index];
  const correct = choice === q.answer;
  state.answers.push({ q, choice, correct });

  for (const b of document.querySelectorAll(".choice")) {
    b.disabled = true;
    b.classList.toggle("picked", b.dataset.answer === choice);
  }

  const verdict = $("verdict");
  verdict.className = `verdict ${correct ? "correct" : "wrong"}`;
  verdict.textContent = correct
    ? "正解！"
    : `不正解… 正解は「${q.answer === "ok" ? "OK" : "エラー"}」`;

  // 未検証の問題は rustc の実行結果を出さない (answer から status を捏造しない)
  const showTerminal = q.verified === true && Array.isArray(q.args);
  $("terminal").hidden = !showTerminal;
  $("unverified").hidden = showTerminal;
  if (showTerminal) $("terminal").innerHTML = terminalHtml(q);
  $("explain").innerHTML = renderText(q.explain);
  $("next").textContent = state.index + 1 === TOTAL ? "結果を見る" : "次へ";
  $("feedback").hidden = false;
  $("progress-bar").style.width = `${((state.index + 1) / TOTAL) * 100}%`;
  $("next").focus({ preventScroll: true });
  $("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function next() {
  if ($("feedback").hidden) return;
  state.index++;
  if (state.index < TOTAL) renderQuestion();
  else showResult();
}

// ---------- result ----------

function shareUrl(score) {
  return `${location.origin}/?s=${score}`;
}

function showResult() {
  const score = state.answers.filter((a) => a.correct).length;
  const rank = RANKS.find((r) => score >= r.min);
  $("score").textContent = score;
  $("rank-title").textContent = rank.title;
  $("rank-comment").textContent = rank.comment;

  const url = shareUrl(score);
  const text = `Are you rust-analyzer? で ${score}/10 点 → 「${rank.title}」でした 🦀\n#AreYouRustAnalyzer`;
  const enc = encodeURIComponent;
  $("share-x").href = `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`;
  $("share-bsky").href = `https://bsky.app/intent/compose?text=${enc(`${text}\n${url}`)}`;
  $("share-misskey").href = `https://misskey-hub.net/share/?text=${enc(`${text}\n${url}`)}&visibility=public&localOnly=0`;
  $("share-threads").href = `https://www.threads.net/intent/post?text=${enc(`${text}\n${url}`)}`;
  $("share-copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      $("share-copy").textContent = "コピーしました";
    } catch {
      $("share-copy").textContent = "コピー失敗";
    }
    setTimeout(() => ($("share-copy").textContent = "コピー"), 1500);
  };
  if (navigator.share) {
    $("share-native").hidden = false;
    $("share-native").onclick = () => navigator.share({ text, url }).catch(() => {});
  }

  $("review").innerHTML = state.answers
    .map(({ q, choice, correct }, i) => {
      const label = (a) => (a === "ok" ? "OK" : "エラー");
      return `<li class="${correct ? "correct" : ""}"><details>
        <summary><span class="mark">${correct ? "○" : "×"}</span> Q${i + 1}
          <span class="chip">${q.level === "basic" ? "基礎" : "応用"}</span>
          <span class="chip">${escapeHtml(q.topic)}</span>
          あなた: ${label(choice)} / 正解: ${label(q.answer)}</summary>
        <div class="body">${editorHtml(q.code)}
          ${
            q.verified === true && Array.isArray(q.args)
              ? `<pre class="terminal">${terminalHtml(q)}</pre>`
              : `<p class="unverified">この問題は未検証です。rustc の実行結果は表示できません。</p>`
          }
          <p class="explain">${renderText(q.explain)}</p></div>
      </details></li>`;
    })
    .join("");

  show("screen-result");
}

// ---------- init ----------

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || $("screen-quiz").hidden) return;
  const k = e.key.toLowerCase();
  if ($("feedback").hidden) {
    if (k === "o") answer("ok");
    else if (k === "x") answer("error");
  } else if (k === "enter" && document.activeElement !== $("next")) {
    e.preventDefault();
    next();
  }
});

for (const b of document.querySelectorAll(".choice")) b.addEventListener("click", () => answer(b.dataset.answer));
$("next").addEventListener("click", next);
$("start").addEventListener("click", startQuiz);
$("home").addEventListener("click", (e) => {
  e.preventDefault();
  const inQuiz = !$("screen-quiz").hidden && state.answers.length < TOTAL;
  if (inQuiz && state.answers.length > 0 && !confirm("途中の回答は破棄されます。ホームに戻りますか？")) return;
  show("screen-start");
});
$("retry").addEventListener("click", startQuiz);

const challenge = Number(new URLSearchParams(location.search).get("s"));
if (Number.isInteger(challenge) && challenge >= 0 && challenge <= TOTAL && location.search.includes("s=")) {
  $("challenge").textContent = `シェア元のスコアは ${challenge}/10 点。超えられる？`;
  $("challenge").hidden = false;
}

fetch("/questions.json")
  .then((r) => r.json())
  .then((data) => {
    state.all = data.questions;
    const m = data.toolchain?.match(/rustc (\S+)/);
    if (m) {
      state.toolchain = m[1];
      for (const el of document.querySelectorAll(".toolchain")) el.textContent = m[1];
    }
    $("start").disabled = false;
    $("start").textContent = "スタート";
  })
  .catch(() => {
    $("start").textContent = "問題の読み込みに失敗しました";
  });
