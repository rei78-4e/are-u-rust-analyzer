// ---
// topic: 借用
// answer: error
// explain: `first` (共有参照) が `println!` で使われるまで生きているため、
// その間に `v.push` で可変借用することはできません (E0502)。
// `push` で再確保が起きると `first` がダングリングになるのを防いでいます。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    v.push(4);
    println!("{first}");
}
