// ---
// topic: イテレータ
// answer: ok
// explain: イテレータは遅延評価なので `map` は何も実行されず、捨てられます。
// `unused_must_use` の警告は出ますが、エラーではないのでコンパイルは通ります。
// ---
fn main() {
    let v = vec![1, 2, 3];
    v.iter().map(|x| x * 2);
    println!("{v:?}");
}
