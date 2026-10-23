// ---
// topic: 所有権
// answer: ok
// explain: `let _ = s;` の `_` は「何も束縛しない」パターンなので、`s` はムーブされません。
// `let _x = s;` と書いた場合はムーブが起き、その後の `s` の使用はエラーになります。
// ---
fn main() {
    let s = String::from("hello");
    let _ = s;
    println!("{s}");
}
