// ---
// topic: クロージャ
// answer: error
// explain: 関数と違ってクロージャには入力から出力へのライフタイム省略規則が適用されず、
// 引数と戻り値の `&i32` が別々のライフタイムとして推論されます (lifetime may not live long enough)。
// `fn` で書くか、型注釈をすべて外して `|x| x` にすると (呼び出し側から推論されて) 通ります。
// ---
fn main() {
    let identity = |x: &i32| -> &i32 { x };
    let n = 1;
    println!("{}", identity(&n));
}
