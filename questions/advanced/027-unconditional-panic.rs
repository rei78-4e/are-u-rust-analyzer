// ---
// topic: lint
// answer: error
// explain: 範囲外アクセスは普通は実行時 panic ですが、定数伝播で「必ず panic する」と分かる場合は
// `unconditional_panic` lint (デフォルト deny) によってコンパイルエラーになります。
// ---
fn main() {
    let a = [1, 2, 3];
    let i = 5;
    println!("{}", a[i]);
}
