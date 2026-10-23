// ---
// topic: 型推論
// answer: error
// explain: `sum()` の戻り値型はジェネリック (`S: Sum<&i32>`) で、`i32` 以外にもなりえます。
// 使い道の `println!` からも型が決まらないので E0283 (type annotations needed) になります。
// ---
fn main() {
    let v = vec![1, 2, 3];
    let total = v.iter().sum();
    println!("{total}");
}
