// ---
// topic: 構文
// answer: ok
// explain: 変数名とフィールド名が同じならフィールド初期化省略記法 `Point { x, y }` が使えます。
// `..base` は構造体更新記法で、残りのフィールドを `base` から持ってきます。
// ---
#[derive(Debug, Clone)]
struct Point {
    x: i32,
    y: i32,
    z: i32,
}

fn main() {
    let x = 1;
    let y = 2;
    let base = Point { x: 0, y: 0, z: 9 };
    let p = Point { x, y, ..base };
    println!("{p:?}");
}
