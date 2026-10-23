// ---
// topic: 借用
// answer: error
// explain: 引数がジェネリクス `T` だと、暗黙の再借用は起きず `r` そのものがムーブされます。
// `&mut i32` は `Copy` ではないため、2回目の `take(r)` は E0382 (use of moved value) です。
// `take(&mut *r)` と明示的に再借用すれば通ります。
// ---
fn take<T>(_x: T) {}

fn main() {
    let mut n = 0;
    let r = &mut n;
    take(r);
    take(r);
}
