// ---
// topic: 数値
// answer: error
// explain: Rust は整数型を暗黙に変換しません。`i32 + i64` はできないので E0308 になります。
// `a as i64 + b` のように明示的に変換が必要です。
// ---
fn main() {
    let a: i32 = 1;
    let b: i64 = 2;
    println!("{}", a + b);
}
