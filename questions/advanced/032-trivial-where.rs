// ---
// topic: トレイト
// answer: ok
// explain: ジェネリクスのない関数にも `where` 句は書けます。`i32: Copy` のように
// 常に成り立つ (trivially true な) 境界なら問題なくコンパイルできます。
// (逆に `String: Copy` のような常に偽な境界はエラーになります)
// ---
fn double(x: i32) -> i32
where
    i32: Copy,
{
    x * 2
}

fn main() {
    println!("{}", double(21));
}
