// ---
// topic: パターン
// answer: error
// explain: `x >= 0` と `x < 0` で全部の場合を網羅していそうですが、コンパイラは match ガードの中身を網羅性チェックに使いません。
// そのため E0004 (non-exhaustive patterns) になります。最後を `_` にすれば通ります。
// ---
fn main() {
    let n: i32 = 5;
    let s = match n {
        x if x >= 0 => "non-negative",
        x if x < 0 => "negative",
    };
    println!("{s}");
}
