// ---
// topic: 所有権
// answer: ok
// explain: `i32` は `Copy` を実装しているので、代入はムーブではなくビット単位のコピーになります。
// `a` も `b` もそのまま使えます。
// ---
fn main() {
    let a: i32 = 42;
    let b = a;
    println!("{a} {b}");
}
