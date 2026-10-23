// ---
// topic: 数値
// answer: error
// explain: 符号なし整数に単項マイナスは使えません (E0600)。
// `u32::MAX` や `0u32.wrapping_sub(1)` を使います。
// ---
fn main() {
    let x: u32 = -1;
    println!("{x}");
}
