// ---
// topic: 数値
// answer: error
// explain: `char` に整数を足す演算は定義されていません (E0369)。
// `(b'a' + 1) as char` や `char::from_u32('a' as u32 + 1)` を使います。
// ---
fn main() {
    let c = 'a' + 1;
    println!("{c}");
}
