// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: edition 2024 では `extern` ブロックは `unsafe extern "C" { ... }` と書く必要があります。
// 宣言が正しいことはプログラマが保証する、という意味です。
// ---
extern "C" {
    fn abs(x: i32) -> i32;
}

fn main() {
    println!("{}", unsafe { abs(-3) });
}
