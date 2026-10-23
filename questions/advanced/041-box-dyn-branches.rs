// ---
// topic: トレイト
// answer: ok
// explain: 戻り値型 `Box<dyn Display>` の期待型が `if` の各分岐に伝わるので、`Box<i32>` と `Box<&str>` がそれぞれ `Box<dyn Display>` に型強制されます。
// ---
use std::fmt::Display;

fn pick(b: bool) -> Box<dyn Display> {
    if b { Box::new(1) } else { Box::new("one") }
}

fn main() {
    println!("{} {}", pick(true), pick(false));
}
