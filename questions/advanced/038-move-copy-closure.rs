// ---
// topic: クロージャ
// answer: ok
// explain: `move` クロージャは捕捉した値をムーブしますが、`i32` は `Copy` なのでコピーされるだけです。
// 元の `x` もそのまま使えます。
// ---
fn main() {
    let x = 5;
    let add = move |y: i32| x + y;
    println!("{} {}", add(1), x);
}
