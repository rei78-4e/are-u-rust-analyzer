// ---
// topic: 構文
// answer: ok
// explain: `[expr; N]` の `expr` は通常 `Copy` が必要ですが、インライン const ブロック
// `const { ... }` (Rust 1.79) なら非 `Copy` 型でも N 回評価されて配列を作れます。
// ---
fn main() {
    let buckets: [Vec<String>; 3] = [const { Vec::new() }; 3];
    println!("{}", buckets.len());
}
