// ---
// topic: 所有権
// answer: error
// explain: `String` は `Copy` ではないので、`let t = s;` で所有権が `t` にムーブされます。
// ムーブ後の `s` は使えないため E0382 (borrow of moved value) になります。
// ---
fn main() {
    let s = String::from("hello");
    let t = s;
    println!("{s} {t}");
}
