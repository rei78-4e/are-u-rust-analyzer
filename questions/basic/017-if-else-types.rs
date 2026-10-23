// ---
// topic: 型
// answer: error
// explain: `if` は式なので、両方の分岐が同じ型である必要があります。
// `1` (整数) と `"one"` (`&str`) は型が違うので E0308 になります。
// ---
fn main() {
    let flag = true;
    let x = if flag { 1 } else { "one" };
    println!("{x}");
}
