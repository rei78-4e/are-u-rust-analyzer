// ---
// topic: 借用
// answer: error
// explain: `s` を `mut` なしで宣言しているので、`&mut s` で可変参照を取ることはできません (E0596)。
// `let mut s = ...` にすれば通ります。
// ---
fn main() {
    let s = String::from("hello");
    let r = &mut s;
    r.push_str(", world");
    println!("{r}");
}
