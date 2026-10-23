// ---
// topic: 所有権
// answer: ok
// explain: `String + &str` は `impl Add<&str> for String` で定義されています。`&b` は `&String` ですが、`&str` に deref 型強制されます。
// `a` はムーブされますが、`b` は借用されただけなので後で使えます。
// ---
fn main() {
    let a = String::from("Hello, ");
    let b = String::from("world");
    let c = a + &b;
    println!("{c} / {b}");
}
