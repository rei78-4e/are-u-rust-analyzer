// ---
// topic: 変数
// answer: ok
// explain: `let` で同じ名前を宣言し直すシャドーイングは合法で、型が変わっても構いません。
// 再代入ではなく「新しい変数」を作っているので `mut` も不要です。
// ---
fn main() {
    let spaces = "   ";
    let spaces = spaces.len();
    let spaces = spaces * 2;
    println!("{spaces}");
}
