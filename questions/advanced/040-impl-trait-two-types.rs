// ---
// topic: トレイト
// answer: error
// explain: `impl Trait` を返す関数は、実際には 1 つの具体型しか返せません。
// `i32` と `&str` を返し分けると E0308。複数の型を返すなら `Box<dyn Display>` が必要です。
// ---
use std::fmt::Display;

fn pick(b: bool) -> impl Display {
    if b { 1 } else { "one" }
}

fn main() {
    println!("{}", pick(true));
}
