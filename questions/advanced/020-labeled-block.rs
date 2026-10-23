// ---
// topic: 構文
// answer: ok
// explain: Rust 1.65 からループではない普通のブロックにもラベルを付けて
// `break 'label value` で値を返しながら脱出できます (labeled block)。
// ---
fn main() {
    let n = 7;
    let kind = 'check: {
        if n % 2 == 0 {
            break 'check "even";
        }
        if n > 5 {
            break 'check "big odd";
        }
        "small odd"
    };
    println!("{kind}");
}
