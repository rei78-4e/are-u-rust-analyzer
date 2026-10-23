// ---
// topic: 並行性
// answer: ok
// explain: `std::thread::scope` (Rust 1.63) で作ったスレッドはスコープを抜ける前に必ず join されるので、
// `'static` でないローカル変数を借用できます。`thread::spawn` だと E0373 になります。
// ---
fn main() {
    let mut data = vec![1, 2, 3];
    let total: i32 = data.iter().sum();
    std::thread::scope(|s| {
        s.spawn(|| println!("total = {total}"));
        s.spawn(|| data.push(4));
    });
    println!("{data:?}");
}
