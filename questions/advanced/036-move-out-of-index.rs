// ---
// topic: 所有権
// answer: error
// explain: `v[0]` は `*v.index(0)` の糖衣構文で、参照の先から値をムーブすることになります。
// `String` は `Copy` でないので E0507 (cannot move out of index)。`&v[0]` や `v[0].clone()` なら通ります。
// ---
fn main() {
    let v = vec![String::from("a")];
    let s = v[0];
    println!("{s}");
}
