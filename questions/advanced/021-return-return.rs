// ---
// topic: 構文
// answer: ok
// explain: `return` は `!` 型を持つ「式」なので、`return` の値として `return` を書けます。
// 到達不能コードの警告は出ますが、エラーではありません。
// ---
fn main() {
    return return return;
}
