// ---
// topic: 借用
// answer: ok
// explain: 2-phase borrow のおかげです。`v.push(..)` の `&mut v` はまず「予約」だけされ、
// 引数 `v.len()` (共有借用) を評価し終わってから有効化されます。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    v.push(v.len());
    println!("{v:?}");
}
