// ---
// topic: ライフタイム
// answer: error
// explain: `x` は内側のブロックの終わりで破棄されますが、`r` はその後も使われています。
// 参照が参照先より長生きしてしまうため E0597 (`x` does not live long enough) です。
// ---
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{r}");
}
