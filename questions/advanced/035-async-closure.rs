// ---
// topic: 非同期
// answer: ok
// explain: Rust 1.85 で async クロージャ `async |x| { ... }` と `AsyncFn` 系トレイトが安定化されました。
// 呼び出すと Future が返ります (ここでは実行していないので runtime は不要です)。
// ---
async fn run<F: AsyncFn(u32) -> u32>(f: F) -> u32 {
    f(1).await + f(2).await
}

fn main() {
    let offset = 10;
    let add = async |x: u32| x + offset;
    let _future = run(add);
}
