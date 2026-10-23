// ---
// topic: クロージャ
// answer: error
// explain: `count` を書き換えるクロージャは `FnMut` で、呼び出すには `&mut` が必要です。
// `inc` 自体を `let mut inc` にしないと E0596 になります。
// ---
fn main() {
    let mut count = 0;
    let inc = || count += 1;
    inc();
    inc();
    println!("{count}");
}
