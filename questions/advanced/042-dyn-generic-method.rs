// ---
// topic: トレイト
// answer: error
// explain: ジェネリックなメソッドを持つトレイトは dyn 互換 (旧称 object safe) ではありません。
// vtable に無数の単相化を載せられないためで、`dyn Greet` は E0038 になります。
// ---
use std::fmt::Display;

trait Greet {
    fn greet<T: Display>(&self, name: T);
}

struct En;

impl Greet for En {
    fn greet<T: Display>(&self, name: T) {
        println!("Hello, {name}");
    }
}

fn main() {
    let g: Box<dyn Greet> = Box::new(En);
    g.greet("Ferris");
}
