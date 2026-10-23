// ---
// topic: ライフタイム
// answer: error
// explain: 参照の引数が 2 つあると、戻り値の参照がどちらに由来するか省略規則で決められません。
// E0106 (missing lifetime specifier) になり、`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` と書く必要があります。
// ---
fn longest(a: &str, b: &str) -> &str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    println!("{}", longest("abc", "de"));
}
