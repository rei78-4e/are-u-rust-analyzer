// ---
// topic: 構文
// answer: ok
// explain: `loop` は式で、`break 値` でその値を返せます。`x` は `i32` の `20` になります。
// ---
fn main() {
    let mut n = 0;
    let x = loop {
        n += 1;
        if n == 10 {
            break n * 2;
        }
    };
    println!("{x}");
}
