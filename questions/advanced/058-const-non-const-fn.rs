// ---
// topic: const
// answer: error
// explain: `const` の初期化式はコンパイル時に評価されるので、`const fn` しか呼べません (E0015)。
// `const fn three()` にすれば通ります。
// ---
fn three() -> usize {
    3
}

const N: usize = three();

fn main() {
    println!("{N}");
}
