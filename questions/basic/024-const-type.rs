// ---
// topic: 変数
// answer: error
// explain: `const` (と `static`) は型注釈が必須です。`let` と違って型推論されません。
// `const MAX: i32 = 10;` と書く必要があります。
// ---
const MAX = 10;

fn main() {
    println!("{MAX}");
}
