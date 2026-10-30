"use strict";

import { rankFor, TOTAL } from "./ranks.js";
import { editorHtml, escapeHtml, highlight, renderText, terminalHtml } from "./render.js";

// 1 回のテストで出す問題数 (合計は ranks.js の TOTAL)
const PICK = { basic: 3, advanced: 7 };

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

// 出題履歴 { [id]: 最後に出題した時刻 } を localStorage に保存し、直近に出た問題を後回しにする
const SEEN_KEY = "seen";

function loadSeen() {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY));
    return seen && typeof seen === "object" ? seen : {};
  } catch {
    return {};
  }
}

function saveSeen(quiz) {
  const seen = loadSeen();
  const now = Date.now();
  for (const q of quiz) seen[q.id] = now;
  // 削除・改名された問題の履歴は捨てる
  const ids = new Set(state.all.map((q) => q.id));
  for (const id of Object.keys(seen)) if (!ids.has(id)) delete seen[id];
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // ストレージが使えない環境では履歴なしで動く
  }
}

function show(screen) {
  for (const id of ["screen-start", "screen-quiz", "screen-result"]) $(id).hidden = id !== screen;
  window.scrollTo({ top: 0 });
}

// ---------- quiz flow ----------

function startQuiz() {
  // 未出題の問題を優先し、全問出し切った後は出題が古い半分からランダムに選ぶ。
  // 古い順に厳密に選ぶと 2 周目以降が 1 周目と同じ組み合わせ・同じ順番になってしまうため。
  const seen = loadSeen();
  const by = (level) => {
    const pool = shuffle(state.all.filter((q) => q.level === level));
    const fresh = pool.filter((q) => !(q.id in seen));
    const old = pool.filter((q) => q.id in seen).sort((a, b) => seen[a.id] - seen[b.id]);
    const half = Math.ceil(old.length / 2);
    return [...fresh, ...shuffle(old.slice(0, half)), ...old.slice(half)].slice(0, PICK[level]);
  };
  state.quiz = [...by("basic"), ...by("advanced")];
  saveSeen(state.quiz);
  state.index = 0;
  state.answers = [];
  show("screen-quiz");
  renderQuestion();
}

function updateProgress() {
  const answered = state.answers.filter(Boolean).length;
  $("progress-bar").style.width = `${(answered / TOTAL) * 100}%`;
}

function renderQuestion() {
  const q = state.quiz[state.index];
  $("q-num").textContent = `Q${state.index + 1}/${TOTAL}`;
  $("q-level").textContent = q.level === "basic" ? "基礎" : "応用";
  $("q-level").className = `chip level-${q.level}`;
  $("q-topic").textContent = q.topic;
  $("q-edition").textContent = `edition ${q.edition}`;
  $("q-code").innerHTML = highlight(q.code);
  $("back").hidden = state.index === 0;

  const entry = state.answers[state.index];
  if (entry) {
    // 回答済みの問題に戻ってきたときは、前回の回答と解説をそのまま表示する
    showAnswered(q, entry.choice);
  } else {
    for (const b of document.querySelectorAll(".choice")) {
      b.disabled = false;
      b.classList.remove("picked");
    }
    $("feedback").hidden = true;
    $("terminal").hidden = true;
    $("unverified").hidden = true;
  }

  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAnswered(q, choice) {
  const correct = choice === q.answer;

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
}

function answer(choice) {
  if (!$("feedback").hidden) return;
  if (state.answers[state.index]) return;
  const q = state.quiz[state.index];
  const correct = choice === q.answer;
  state.answers[state.index] = { q, choice, correct };

  showAnswered(q, choice);
  updateProgress();
  $("next").focus({ preventScroll: true });
  $("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function next() {
  if ($("feedback").hidden) return;
  if (state.index + 1 === TOTAL) {
    showResult();
    return;
  }
  state.index++;
  renderQuestion();
}

function back() {
  if (state.index === 0) return;
  state.index--;
  renderQuestion();
}

// ---------- result ----------

function shareUrl(score) {
  return `${location.origin}/?s=${score}`;
}

function showResult() {
  const score = state.answers.filter((a) => a.correct).length;
  const rank = rankFor(score);
  $("score").textContent = score;
  $("rank-title").textContent = rank.title;
  $("rank-comment").textContent = rank.comment;

  const url = shareUrl(score);
  const text = `Are you rust-analyzer? で ${score}/10 点 → 「${rank.title}」でした 🦀\n#AreYouRustAnalyzer`;
  const enc = encodeURIComponent;
  $("share-x").href = `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`;
  $("share-bsky").href = `https://bsky.app/intent/compose?text=${enc(`${text}\n${url}`)}`;
  $("share-misskey").href = `https://misskey-hub.net/share/?text=${enc(`${text}\n${url}`)}&visibility=public&localOnly=0`;
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
  if (k === "arrowleft") {
    e.preventDefault();
    back();
  } else if ($("feedback").hidden) {
    if (k === "o") answer("ok");
    else if (k === "x") answer("error");
  } else if (k === "enter" && document.activeElement !== $("next") && document.activeElement !== $("back")) {
    e.preventDefault();
    next();
  }
});

for (const b of document.querySelectorAll(".choice")) b.addEventListener("click", () => answer(b.dataset.answer));
$("next").addEventListener("click", next);
$("back").addEventListener("click", back);
$("start").addEventListener("click", startQuiz);
$("home").addEventListener("click", (e) => {
  e.preventDefault();
  const answered = state.answers.filter(Boolean).length;
  const inQuiz = !$("screen-quiz").hidden && answered < TOTAL;
  if (inQuiz && answered > 0 && !confirm("途中の回答は破棄されます。ホームに戻りますか？")) return;
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
