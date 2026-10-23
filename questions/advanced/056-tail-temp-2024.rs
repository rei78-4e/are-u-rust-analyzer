// ---
// topic: エディション
// answer: ok
// edition: 2024
// explain: edition 2024 では、ブロック末尾の式の一時値 (`c.borrow()` の `Ref`) はローカル変数より先に破棄されます。
// `c` が破棄される時点で借用は終わっているので通ります。
// ---
use std::cell::RefCell;

fn len() -> usize {
    let c = RefCell::new(String::from("rust"));
    c.borrow().len()
}

fn main() {
    println!("{}", len());
}
