// ---
// topic: パターン
// answer: error
// edition: 2024
// explain: `&Option<String>` に `Some(..)` でマッチすると、デフォルト束縛モードが自動で `ref` になります。
// edition 2024 ではその中で明示的に `ref` を書くことが禁止されました
// (cannot explicitly borrow within an implicitly-borrowing pattern)。`Some(s)` と書けば OK。
// ---
fn main() {
    let name = Some(String::from("Ferris"));
    match &name {
        Some(ref s) => println!("{s}"),
        None => {}
    }
}
