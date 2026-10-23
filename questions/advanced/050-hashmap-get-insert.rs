// ---
// topic: 借用
// answer: error
// explain: `m.get` が返す `Option<&i32>` は `m` を借用しています。それが生きている間に `m.insert` (`&mut self`) はできず E0502。
// `m.get("a").copied()` で値をコピーしておけば通ります。
// ---
use std::collections::HashMap;

fn main() {
    let mut m = HashMap::new();
    m.insert("a", 1);
    let a = m.get("a");
    m.insert("b", 2);
    println!("{a:?}");
}
