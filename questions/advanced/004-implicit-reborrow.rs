// ---
// topic: 借用
// answer: ok
// explain: `&mut T` は `Copy` ではありませんが、引数の型が `&mut i32` と明示されている場合は
// 暗黙の再借用 (`&mut *r`) が挿入されるので、`r` はムーブされず何度でも渡せます。
// ---
fn bump(x: &mut i32) {
    *x += 1;
}

fn main() {
    let mut n = 0;
    let r = &mut n;
    bump(r);
    bump(r);
    println!("{n}");
}
