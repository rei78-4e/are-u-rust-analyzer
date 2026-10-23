// ---
// topic: 所有権
// answer: ok
// explain: `..a` でムーブされるのは、明示しなかったフィールド (`name` と `age`) だけです。
// `name` はムーブされますが `email` は残っており、`age` は `Copy` なので、`a.email` と `a.age` は使えます。
// ---
struct User {
    name: String,
    email: String,
    age: u32,
}

fn main() {
    let a = User {
        name: String::from("ferris"),
        email: String::from("a@example.com"),
        age: 10,
    };
    let b = User { email: String::from("b@example.com"), ..a };
    println!("{} {}", a.email, a.age);
    println!("{} {} {}", b.name, b.email, b.age);
}
