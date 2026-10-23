// ---
// topic: const
// answer: ok
// explain: const ジェネリクスの `N` も型推論の対象です。変数の型 `[i32; 4]` から `N = 4` と推論されます。
// ---
fn zeros<const N: usize>() -> [i32; N] {
    [0; N]
}

fn main() {
    let a: [i32; 4] = zeros();
    println!("{a:?}");
}
