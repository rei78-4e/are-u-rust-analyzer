// ---
// topic: 数値
// answer: ok
// explain: `u8` から `char` への `as` キャストは許可されています (0〜255 は全部有効な Unicode スカラー値なので)。
// `u32 as char` はダメですが `u8 as char` は OK です。
// ---
fn main() {
    let c = 97u8 as char;
    println!("{c}");
}
