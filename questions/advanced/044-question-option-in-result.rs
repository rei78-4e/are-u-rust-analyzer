// ---
// topic: エラー処理
// answer: error
// explain: `Result` を返す関数の中で `Option` に `?` は使えません (E0277)。`None` を何のエラーに変換すればいいか決まらないためです。
// `.ok_or("empty")?` などで `Result` に変換します。
// ---
fn first_char(s: &str) -> Result<char, String> {
    let c = s.chars().next()?;
    Ok(c)
}

fn main() {
    println!("{:?}", first_char("rust"));
}
