// ---
// topic: 借用
// answer: error
// explain: `for x in &v` はループ中ずっと `v` を共有借用しています。その中で `v.push` (`&mut self`) はできず E0502。
// もし許すと再確保でイテレータが壊れるため、借用チェッカーが防いでいます。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    for x in &v {
        if *x > 1 {
            v.push(*x);
        }
    }
    println!("{v:?}");
}
