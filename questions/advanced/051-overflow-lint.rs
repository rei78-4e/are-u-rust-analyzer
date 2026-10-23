// ---
// topic: lint
// answer: error
// explain: `x` が `255` だとコンパイラが追跡できるので、`x + 1` が必ずオーバーフローすると分かります。
// `arithmetic_overflow` は deny の lint なので、実行前にコンパイルエラーになります。
// ---
fn main() {
    let x: u8 = 255;
    let y = x + 1;
    println!("{y}");
}
