// ---
// topic: イテレータ
// answer: ok
// explain: `String` は `FromIterator<char>` を実装しているので、`char` のイテレータを `collect` で `String` にできます。
// ---
fn main() {
    let s: String = vec!['r', 'u', 's', 't'].into_iter().rev().collect();
    println!("{s}");
}
