// ---
// topic: マクロ
// answer: error
// explain: 関数やアイテムは定義の前に使えますが、`macro_rules!` は「テキスト上で定義より後ろ」でしか使えません
// (textual scoping)。`cannot find macro` になります。
// ---
fn main() {
    greet!();

    macro_rules! greet {
        () => {
            println!("hi");
        };
    }
}
