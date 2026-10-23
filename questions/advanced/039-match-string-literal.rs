// ---
// topic: パターン
// answer: error
// explain: `String` を文字列リテラル (`&str`) のパターンで match することはできず、E0308 になります。
// `match s.as_str()` にすれば通ります。
// ---
fn main() {
    let s = String::from("yes");
    let b = match s {
        "yes" => true,
        _ => false,
    };
    println!("{b}");
}
