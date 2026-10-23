// ---
// topic: 標準ライブラリ
// answer: error
// explain: `ExactSizeIterator` は `RangeInclusive<i32>` には実装されていません
// (`0..=i32::MAX` の長さが 32bit 環境の `usize` に収まらない可能性があるため)。
// `(1..5).len()` (半開区間) なら通ります。
// ---
fn main() {
    println!("{}", (1..=5).len());
}
