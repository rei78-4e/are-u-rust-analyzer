// ---
// topic: ライフタイム
// answer: ok
// explain: 定数式への参照 `&5` は rvalue static promotion によって静的領域に置かれるため、
// `&'static i32` として扱えます。`let x = 5; &x` だとローカル変数なのでエラーになります。
// ---
fn forever() -> &'static i32 {
    &5
}

fn main() {
    let r: &'static [i32] = &[1, 2, 3];
    println!("{} {:?}", forever(), r);
}
