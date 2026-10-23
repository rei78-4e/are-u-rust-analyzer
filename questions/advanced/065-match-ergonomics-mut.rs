// ---
// topic: パターン
// answer: ok
// explain: `&mut (i32, i32)` を `(a, b)` で分解すると、match ergonomics により `a` と `b` は `&mut i32` になります。
// `*a += 10` で元のタプルを書き換えられます。
// ---
fn main() {
    let (a, b) = &mut (1, 2);
    *a += 10;
    println!("{a} {b}");
}
