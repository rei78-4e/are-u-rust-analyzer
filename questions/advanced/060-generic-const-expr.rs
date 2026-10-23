// ---
// topic: const
// answer: error
// explain: stable では、const ジェネリクスのパラメータを使った式 (`N + 1`) を型の中に書けません。
// 「generic parameters may not be used in const operations」になります (`generic_const_exprs` は nightly のみ)。
// ---
fn push<const N: usize>(a: [i32; N], x: i32) -> [i32; N + 1] {
    todo!()
}

fn main() {
    let a = push([1, 2], 3);
    println!("{a:?}");
}
