// ---
// topic: エディション
// answer: error
// edition: 2024
// explain: edition 2024 では `no_mangle` などのシンボルに影響する属性は unsafe 属性扱いになり、`#[unsafe(no_mangle)]` と書く必要があります。
// ---
#[no_mangle]
pub extern "C" fn hello() -> i32 {
    42
}

fn main() {
    println!("{}", hello());
}
