// ---
// topic: 文字列
// answer: error
// explain: `String` は整数でインデックスできません (E0277)。UTF-8 では 1 文字が 1 バイトとは限らないためです。
// `s.chars().next()` や `&s[0..1]` (バイト範囲のスライス) を使います。
// ---
fn main() {
    let s = String::from("hello");
    let c = s[0];
    println!("{c}");
}
