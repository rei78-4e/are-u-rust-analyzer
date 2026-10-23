// ---
// topic: 借用
// answer: ok
// explain: NLL (Non-Lexical Lifetimes) により、参照の寿命は「最後に使われた場所」までです。
// `first` は `println!` の後もう使われないので、その後の `v.push` は問題ありません。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    println!("{first}");
    v.push(4);
}
