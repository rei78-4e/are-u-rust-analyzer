// ---
// topic: 変数
// answer: ok
// explain: `let x;` と宣言だけしておき、後で「ちょうど1回」代入するのは `mut` なしで OK です。
// コンパイラはすべての分岐で1回ずつ初期化されることを確認しています。
// ---
fn main() {
    let x;
    if std::env::args().count() > 1 {
        x = "args";
    } else {
        x = "no args";
    }
    println!("{x}");
}
