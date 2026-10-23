// ---
// topic: マクロ
// answer: error
// explain: フォーマット文字列に直接書けるのは「識別子」だけで、`{p.x}` のようなフィールドアクセスや
// 式は書けません (invalid format string: field access isn't supported)。`println!("x = {}", p.x)` と書きます。
// ---
struct Point {
    x: i32,
}

fn main() {
    let p = Point { x: 3 };
    println!("x = {p.x}");
}
