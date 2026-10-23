// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: edition 2024 では将来のジェネレータ用に `gen` が予約語になりました。
// 変数名に使いたい場合は `r#gen` と raw identifier で書く必要があります。(`rand` の `rng.gen()` もこの影響で `random()` に改名されました)
// ---
fn main() {
    let gen = 42;
    println!("{gen}");
}
