// ---
// topic: 数値
// answer: error
// explain: `u8` の範囲は 0..=255 です。範囲外のリテラルは `overflowing_literals` lint に引っかかり、
// この lint はデフォルトで deny なのでコンパイルエラーになります。
// ---
fn main() {
    let x: u8 = 256;
    println!("{x}");
}
