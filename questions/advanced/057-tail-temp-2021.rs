// ---
// topic: エディション
// answer: error
// edition: 2021
// explain: edition 2021 以前では、ブロック末尾の式の一時値 (`c.borrow()` の `Ref`) はローカル変数 `c` より後まで生き残ります。
// `c` が先に破棄されてしまうので E0597。edition 2024 ならこのコードは通ります。
// ---
use std::cell::RefCell;

fn len() -> usize {
    let c = RefCell::new(String::from("rust"));
    c.borrow().len()
}

fn main() {
    println!("{}", len());
}
