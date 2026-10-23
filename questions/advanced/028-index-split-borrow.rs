// ---
// topic: 借用
// answer: error
// explain: 借用チェッカーはインデックスの値まで見ないので、`v[0]` と `v[1]` は「`v` 全体の可変借用」2つとして扱われます (E0499)。
// 別々の要素を同時に可変借用するには `split_at_mut` や `get_disjoint_mut` を使います。
// ---
fn main() {
    let mut v = vec![1, 2];
    let a = &mut v[0];
    let b = &mut v[1];
    std::mem::swap(a, b);
    println!("{v:?}");
}
