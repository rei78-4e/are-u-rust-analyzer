// ---
// topic: エラー処理
// answer: ok
// explain: `main` は `Result<(), E>` (E: Debug) を返せるので、`main` の中でも `?` が使えます。
// `ParseIntError` は `?` によって `From` 経由で `Box<dyn Error>` に変換されます。
// ---
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let n: i32 = "42".parse()?;
    println!("{n}");
    Ok(())
}
