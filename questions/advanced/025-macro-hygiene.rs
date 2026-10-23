// ---
// topic: マクロ
// answer: error
// explain: `macro_rules!` は衛生的 (hygienic) です。マクロ内部で `let x` した変数は、
// 呼び出し側から書いた `x` とは別物として扱われるので、`x` が見つからずエラーになります。
// ---
macro_rules! make_x {
    () => {
        let x = 42;
    };
}

fn main() {
    make_x!();
    println!("{x}");
}
