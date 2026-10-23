// ---
// topic: 構文
// answer: ok
// edition: 2024
// explain: Rust 1.88 / edition 2024 で `if let` を `&&` でつなげる let chains が安定化されました。
// `let` と普通の bool 条件を自由に混ぜられます。
// ---
fn main() {
    let a = Some(5);
    let b: Result<i32, ()> = Ok(3);
    if let Some(x) = a
        && x > 3
        && let Ok(y) = b
    {
        println!("{}", x + y);
    }
}
