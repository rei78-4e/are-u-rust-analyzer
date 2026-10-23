// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: マルチスレッド環境で環境変数を書き換えるとデータ競合が起こりうるため、
// edition 2024 から `std::env::set_var` / `remove_var` は `unsafe fn` 扱いです (E0133)。
// ---
fn main() {
    std::env::set_var("RUST_LOG", "debug");
    println!("{:?}", std::env::var("RUST_LOG"));
}
