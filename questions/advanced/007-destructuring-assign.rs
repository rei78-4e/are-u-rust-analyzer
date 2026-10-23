// ---
// topic: 構文
// answer: ok
// explain: Rust 1.59 から代入の左辺にタプル・スライス・構造体パターンを書けます (destructuring assignment)。
// `_ = expr;` も有効で、戻り値を明示的に捨てる書き方として使えます。
// ---
fn main() {
    let (mut a, mut b) = (1, 2);
    (a, b) = (b, a);
    [a, .., b] = [10, 20, 30];
    _ = a + b;
    println!("{a} {b}");
}
