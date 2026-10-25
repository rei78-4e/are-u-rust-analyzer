// トップページ (/) だけを処理する Worker。それ以外は静的アセットがそのまま返る。
// クローラーは JS を実行しないので、シェアリンク (/?s=n) の OG メタタグをここでスコアに合わせて書き換える。
// og:image / og:url はクローラーのために絶対 URL にする。
import { TOTAL, rankFor } from "../public/ranks.js";

const SITE = "Are you rust-analyzer?";

function meta(url) {
  const s = url.searchParams.get("s");
  const score = s !== null && /^\d+$/.test(s) ? Number(s) : NaN;
  if (Number.isInteger(score) && score >= 0 && score <= TOTAL) {
    const rank = rankFor(score);
    return {
      title: `${score}/${TOTAL} 点「${rank.title}」 - ${SITE}`,
      description: `${rank.comment} そのコード、コンパイル通る？ Rust のコンパイル可否を当てる ${TOTAL} 問クイズ。`,
      image: `${url.origin}/og/${score}.png`,
      url: `${url.origin}/?s=${score}`,
    };
  }
  return { image: `${url.origin}/og/default.png`, url: `${url.origin}/` };
}

const setContent = (value) => ({ element: (el) => el.setAttribute("content", value) });

export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    if (!res.headers.get("content-type")?.includes("text/html")) return res;

    const m = meta(new URL(request.url));
    let rw = new HTMLRewriter()
      .on('meta[property="og:image"]', setContent(m.image))
      .on('meta[name="twitter:image"]', setContent(m.image))
      .on('meta[property="og:url"]', setContent(m.url));
    if (m.title) {
      rw = rw
        .on("title", { element: (el) => el.setInnerContent(m.title) })
        .on('meta[property="og:title"]', setContent(m.title))
        .on('meta[name="twitter:title"]', setContent(m.title))
        .on('meta[name="description"]', setContent(m.description))
        .on('meta[property="og:description"]', setContent(m.description))
        .on('meta[name="twitter:description"]', setContent(m.description));
    }
    return rw.transform(res);
  },
};
