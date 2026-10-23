// ---
// topic: 構文
// answer: error
// explain: 識別子には Unicode の XID 文字 (漢字やひらがなも OK) が使えますが、絵文字は使えません。
// ちなみに 🦀 の場合だけ「Ferris cannot be used as an identifier」という専用のエラーが出ます。
// ---
fn main() {
    let 錆 = "rust";
    let 🦀 = 錆;
    println!("{}", 🦀);
}
