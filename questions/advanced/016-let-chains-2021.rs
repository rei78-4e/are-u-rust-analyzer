// ---
// topic: エディション
// answer: error
// edition: 2021
// explain: let chains は edition 2024 限定です。edition 2021 では
// `let` 式を `&&` でつなぐことはできずエラーになります (if let の一時値のドロップ順が 2024 で変わったため)。
// ---
fn main() {
    let a = Some(5);
    let b: Result<i32, ()> = Ok(3);
    if let Some(x) = a
        && x > 3
        && let Ok(y) = b
    {
        println!("{}", x + y);
    }
}
