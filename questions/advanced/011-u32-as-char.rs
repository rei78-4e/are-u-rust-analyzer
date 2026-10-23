// ---
// topic: 数値
// answer: error
// explain: `as char` でキャストできるのは `u8` だけです (E0604)。
// `u32` にはサロゲート領域など `char` として無効な値があるので、`char::from_u32` を使います。
// ---
fn main() {
    let c = 97u32 as char;
    println!("{c}");
}
