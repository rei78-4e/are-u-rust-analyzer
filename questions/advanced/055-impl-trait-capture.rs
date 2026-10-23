// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: edition 2024 では、戻り値の `impl Trait` がスコープ内の全ライフタイムを暗黙に捕捉します。
// `f` が `&n` の借用を保持しているとみなされるので、`n = 2` が E0506 になります。`+ use<>` を付ければ捕捉しないと明示できます。
// ---
fn make_counter(x: &i32) -> impl Fn() -> i32 {
    let base = *x;
    move || base + 1
}

fn main() {
    let mut n = 1;
    let f = make_counter(&n);
    n = 2;
    println!("{} {}", f(), n);
}
