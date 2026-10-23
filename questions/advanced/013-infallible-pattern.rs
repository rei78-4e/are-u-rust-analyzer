// ---
// topic: パターン
// answer: ok
// explain: Rust 1.82 から、空の型 (`Infallible` など) を含むバリアントは「到達不能」として扱われます。
// `Result<i32, Infallible>` の `Err` は作れないので、`let Ok(x) = r;` は反駁不可能パターンになります。
// ---
use std::convert::Infallible;

fn parse() -> Result<i32, Infallible> {
    Ok(42)
}

fn main() {
    let Ok(x) = parse();
    println!("{x}");
}
