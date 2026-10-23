// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: edition 2024 では `static mut` への参照を作る `static_mut_refs` lint が deny になりました。
// `println!` は引数の参照を取るので、`unsafe` の中でもエラーになります。`COUNTER += 1` だけなら参照ではないので問題ありません。
// ---
static mut COUNTER: u32 = 0;

fn main() {
    unsafe {
        COUNTER += 1;
        println!("{}", COUNTER);
    }
}
