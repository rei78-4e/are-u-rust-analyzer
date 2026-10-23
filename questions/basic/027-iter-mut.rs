// ---
// topic: 借用
// answer: ok
// explain: `for x in &mut v` で各要素の `&mut i32` が得られ、`*x += 1` で書き換えられます。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    for x in &mut v {
        *x += 1;
    }
    println!("{v:?}");
}
