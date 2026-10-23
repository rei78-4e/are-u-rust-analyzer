// ---
// topic: 型推論
// answer: error
// explain: `2.0` は `{float}` のままで `f32` か `f64` か決まっていません。
// 型が確定していない数値に対してメソッドは呼べず、E0689 (can't call method on ambiguous numeric type) になります。
// `2.0_f64` や `let x: f64` と書けば通ります。
// ---
fn main() {
    let x = 2.0;
    println!("{}", x.powi(2));
}
