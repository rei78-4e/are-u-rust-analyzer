// ---
// topic: 型推論
// answer: error
// explain: `Vec::new()` の要素型 `T` を決める手がかりがどこにもないため、
// E0282 (type annotations needed) になります。`len()` だけでは型は決まりません。
// ---
fn main() {
    let v = Vec::new();
    println!("{}", v.len());
}
