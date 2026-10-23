// ---
// topic: トレイト
// answer: error
// explain: 型パラメータには暗黙に `Sized` 境界が付きます。`T = dyn Display` は `Sized` ではないので E0277。
// `fn show<T: Display + ?Sized>(t: &T)` にすれば通ります。
// ---
use std::fmt::Display;

fn show<T: Display>(t: &T) {
    println!("{t}");
}

fn main() {
    let d: &dyn Display = &42;
    show(d);
}
