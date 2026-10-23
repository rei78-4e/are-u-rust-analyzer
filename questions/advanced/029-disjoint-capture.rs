// ---
// topic: クロージャ
// answer: ok
// explain: edition 2021 以降、クロージャは構造体全体ではなく「使っているフィールド」だけをキャプチャします
// (disjoint capture)。`c` は `cfg.name` しか借用していないので、`cfg.hits` は可変借用できます。
// ---
struct Config {
    name: String,
    hits: Vec<u32>,
}

fn main() {
    let mut cfg = Config { name: "rust".into(), hits: vec![] };
    let c = || println!("{}", cfg.name);
    cfg.hits.push(1);
    c();
}
