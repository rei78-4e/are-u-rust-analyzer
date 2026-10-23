// ---
// topic: 標準ライブラリ
// answer: ok
// explain: `char` は `Step` を実装しているので、`'a'..='z'` のような範囲をそのまま反復できます。
// (サロゲート領域は自動でスキップされます)
// ---
fn main() {
    let alphabet: String = ('a'..='z').collect();
    println!("{alphabet}");
}
