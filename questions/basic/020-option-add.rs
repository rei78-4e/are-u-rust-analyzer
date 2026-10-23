// ---
// topic: 型
// answer: error
// explain: `Vec::get` は `Option<&i32>` を返すので、そのまま `+ 1` はできません (E0369)。
// `if let Some(x)` や `unwrap` などで中身を取り出す必要があります。
// ---
fn main() {
    let v = vec![1, 2, 3];
    let first = v.get(0);
    println!("{}", first + 1);
}
