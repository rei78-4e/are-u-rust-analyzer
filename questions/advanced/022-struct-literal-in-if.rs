// ---
// topic: 構文
// answer: error
// explain: `if` の条件式の中では `P { x: 1 }` の `{` が if の本体の開始と区別できないため、
// 構造体リテラルは書けません (struct literals are not allowed here)。`(P { x: 1 })` と括弧で囲めば通ります。
// ---
#[derive(PartialEq)]
struct P {
    x: i32,
}

fn main() {
    let p = P { x: 1 };
    if p == P { x: 1 } {
        println!("same");
    }
}
