# Are you rust-analyzer?

Rust のコードを見て「コンパイルが通るか」を考える 10 問クイズです。
基礎 3 問 + 応用 7 問がランダムに出題されます。判定はフロントエンドのみで行い、Cloudflare Workers (静的アセット) で動きます。

すべての問題の正解は、実際の rustc 1.99.1 でコンパイルして検証しています。

## 開発

```sh
npm install
npm run dev      # questions.json を生成して wrangler dev を起動
npm run deploy   # Cloudflare Workers にデプロイ
npm test         # 描画関数の round-trip テスト (rustc 不要)
npm run og       # シェア用 OG 画像 (public/og/*.png) を再生成
```

シェアリンク (`/?s=<点数>`) の OG メタタグは `src/worker.js` がスコアに合わせて書き換え、
画像は `public/og/<点数>.png` を使います。画像はコミット済みで、称号 (`public/ranks.js`) や
デザインを変えたときだけ `npm run og` で作り直します (Noto Sans JP と Monaspace Radon のシステムフォントが必要)。

独自ドメインで公開する場合は、`wrangler.jsonc` の `routes` のコメントを外してください。

## 問題の追加

`questions/basic/` (基礎) か `questions/advanced/` (応用) に `.rs` ファイルを 1 つ置くだけです。

```rust
// ---
// topic: 借用
// answer: error
// edition: 2024
// explain: 解説文。`code` はインラインコードになります。
// キーのない行は前のキーの続き (改行) として扱われます。
// ---
fn main() {
    // ここから下が出題されるコード
}
```

| キー      | 必須 | 内容                                                  |
| --------- | ---- | ----------------------------------------------------- |
| `answer`  | ○    | `ok` (コンパイルが通る) / `error` (コンパイルエラー) |
| `explain` | ○    | 回答後に表示する解説                                  |
| `topic`   |      | 画面に表示するタグ (所有権、借用など)                 |
| `edition` |      | `2015` / `2018` / `2021` / `2024` (省略時は `2024`)   |

追加したら検証します。

```sh
rustup toolchain install 1.99.1 --profile minimal   # 初回のみ
npm run verify            # 全問題をコンパイルして answer と照合
npm run verify -- 036     # id の部分一致で絞り込み
```

`npm run verify` は結果と rustc のエラーメッセージを `questions/verified.json` に保存します。
このファイルはコミットしてください。`npm run build` はこの保存結果を使うので、rustc がないビルド環境でも動きます。

- 検証に失敗した問題が 1 つでもあると、`verified.json` は更新されません (終了コード 1)。
- `verified.json` には問題ごとに、実行した rustc のバージョンと引数 (`rustc +1.99.1 --edition 2024 main.rs`) も保存されます。
- 複数の toolchain の結果が混在していると、build は失敗します。別の toolchain に変えるときは全問を検証し直してください。
- build は `status` と `compiles` の矛盾、エラー問題の `output` に error 行があるか、成功問題に error 行が混ざっていないかなども検査し、矛盾があれば失敗します。
- 未検証 (verified.json に結果がない、またはコードが変わった) 問題は警告を出して出題されます。この場合、画面には rustc の実行結果を表示せず「未検証」と表示します。
- `npm run verify -- 036` のように絞り込んだ場合、他の問題の検証結果はそのまま残ります。ただし toolchain が既存の結果と違う場合は混在を防ぐため書き込みません。

別のツールチェインで検証する場合は `RUST_TOOLCHAIN=1.100.0 npm run verify` のように指定します。
全問を同じ toolchain で検証し直す必要があります。

## CI

GitHub Actions (`.github/workflows/ci.yml`) で以下を実行します。

- `npm test` — 描画関数 (`public/render.js`) の round-trip テスト
- `npm run verify` — rustc 1.99.1 で全問をコンパイル
- `questions/verified.json` が最新か (`git diff --exit-code`)
- `npm run build` — `public/questions.json` の生成
