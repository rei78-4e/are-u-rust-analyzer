// ---
// topic: トレイト
// answer: error
// explain: `P` は `hello` という同名メソッドを持つトレイトを 2 つ実装しているので、`P.hello()` がどちらか決まりません (E0034)。
// `English::hello(&P)` のように完全修飾で呼ぶ必要があります。
// ---
trait English {
    fn hello(&self) -> &str {
        "hello"
    }
}

trait Japanese {
    fn hello(&self) -> &str {
        "こんにちは"
    }
}

struct P;
impl English for P {}
impl Japanese for P {}

fn main() {
    println!("{}", P.hello());
}
