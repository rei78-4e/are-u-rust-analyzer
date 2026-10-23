// ---
// topic: パターン
// answer: ok
// explain: let-else は反駁可能なパターン用ですが、`x` のように必ずマッチするパターンでも
// `irrefutable_let_patterns` の警告が出るだけでエラーにはなりません。
// ---
fn main() {
    let x = 5 else {
        return;
    };
    println!("{x}");
}
