// ---
// topic: 借用
// answer: error
// explain: `&mut v[0]` と `&mut v[1]` はどちらも `v` 全体の可変借用 (`IndexMut::index_mut(&mut v, ..)`) なので、同時には取れません (E0499)。
// `v.swap(0, 1)` か `split_at_mut` を使います。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    std::mem::swap(&mut v[0], &mut v[1]);
    println!("{v:?}");
}
