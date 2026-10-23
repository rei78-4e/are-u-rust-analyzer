// ---
// topic: 所有権
// answer: error
// explain: `for x in v` は `IntoIterator::into_iter(v)` を呼ぶので `v` がムーブされます。
// ループ後に `v` を使うと E0382。借用したいなら `for x in &v` と書きます。
// ---
fn main() {
    let v = vec![String::from("a"), String::from("b")];
    for x in v {
        println!("{x}");
    }
    println!("{}", v.len());
}
