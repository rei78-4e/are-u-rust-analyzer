// ---
// topic: エラー処理
// answer: ok
// explain: `?` はエラーを `From::from` で変換します。`ParseIntError` は `Error` を実装しているので、`Box<dyn Error>` に変換できます。
// ---
use std::error::Error;

fn parse(s: &str) -> Result<i32, Box<dyn Error>> {
    let n: i32 = s.parse()?;
    Ok(n * 2)
}

fn main() {
    println!("{:?}", parse("21").unwrap());
}
