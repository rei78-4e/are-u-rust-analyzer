// ---
// topic: ライフタイム
// answer: ok
// explain: 引数の参照が 1 つだけなら、ライフタイム省略規則で戻り値の参照はその引数と同じライフタイムになります。
// 注釈なしで通ります。
// ---
fn first(v: &Vec<i32>) -> &i32 {
    &v[0]
}

fn main() {
    let v = vec![10, 20];
    println!("{}", first(&v));
}
