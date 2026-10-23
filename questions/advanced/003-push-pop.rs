// ---
// topic: 借用
// answer: error
// explain: 2-phase borrow で予約中に許されるのは「共有」借用だけです。
// 引数の `v.pop()` は `&mut v` を必要とするため E0499 (cannot borrow `v` as mutable more than once) になります。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    v.push(v.pop().unwrap());
    println!("{v:?}");
}
