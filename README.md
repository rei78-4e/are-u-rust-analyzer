# Are you rust-analyzer?

Rust のコードを見て「コンパイルが通るか」を当てる 10 問クイズです。
基礎 3 問 + 応用 7 問がランダムに出題されます。判定はフロントエンドのみで行い、Cloudflare Workers (静的アセット) で動きます。

すべての問題の正解は、実際の rustc 1.99.1 でコンパイルして検証しています。

## 開発

```sh
npm install
npm run dev      # questions.json を生成して wrangler dev を起動
npm run deploy   # Cloudflare Workers にデプロイ
```

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

- `answer` と rustc の結果が食い違う問題があると、build は失敗します。
- 未検証 (verified.json に結果がない、またはコードが変わった) 問題は警告を出して出題されます。この場合、解説欄に rustc のエラーメッセージは表示されません。

別のツールチェインで検証する場合は `RUST_TOOLCHAIN=1.100.0 npm run verify` のように指定します。
