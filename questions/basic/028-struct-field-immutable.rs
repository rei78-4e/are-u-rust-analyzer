// ---
// topic: 変数
// answer: error
// explain: 構造体のフィールドだけを `mut` にすることはできず、可変性は変数 `p` 単位で決まります。
// `p` が `mut` でないので `p.x = 5` は E0594 になります。
// ---
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    p.x = 5;
    println!("{} {}", p.x, p.y);
}
