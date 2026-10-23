// ---
// topic: トレイト
// answer: ok
// explain: `impl<T: Display> Shout for T` と `impl Shout for Cat` は一見衝突しそうですが、
// `Cat` はローカル型で `Display` を実装していないとコンパイラが断言できる (negative reasoning) ので、重複になりません。
// ---
use std::fmt::Display;

trait Shout {
    fn shout(&self) -> String;
}

impl<T: Display> Shout for T {
    fn shout(&self) -> String {
        format!("{self}!")
    }
}

struct Cat;

impl Shout for Cat {
    fn shout(&self) -> String {
        "meow".into()
    }
}

fn main() {
    println!("{} {}", 1.shout(), Cat.shout());
}
