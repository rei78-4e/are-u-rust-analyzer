// ---
// topic: 借用
// answer: ok
// explain: `split_at_mut` は 1 つのスライスを重ならない 2 つの `&mut [T]` に分けます。
// 別々の可変参照なので、両方を同時に使えます。
// ---
fn main() {
    let mut v = vec![1, 2, 3];
    let (a, b) = v.split_at_mut(1);
    std::mem::swap(&mut a[0], &mut b[0]);
    println!("{v:?}");
}
