// ---
// topic: マクロ
// answer: ok
// explain: Rust 1.58 からフォーマット文字列内でスコープ内の変数を直接参照できます
// (inline format args)。幅や精度も `{pi:.prec$}` のように変数で指定できます。
// ---
fn main() {
    let name = "Ferris";
    let pi = 3.14159;
    let prec = 2;
    println!("Hello, {name}! pi = {pi:.prec$}");
}
