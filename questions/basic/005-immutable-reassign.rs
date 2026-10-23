// ---
// topic: 変数
// answer: error
// explain: 変数はデフォルトで不変です。`mut` なしで再代入すると E0384
// (cannot assign twice to immutable variable) になります。
// ---
fn main() {
    let count = 0;
    count = count + 1;
    println!("{count}");
}
