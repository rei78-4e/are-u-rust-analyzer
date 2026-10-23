// ---
// topic: トレイト
// answer: error
// explain: 孤児ルール: 外部のトレイト (`Display`) を外部の型 (`Vec<i32>`) に実装することはできません (E0117)。
// newtype (`struct MyVec(Vec<i32>)`) で包む必要があります。
// ---
use std::fmt;

impl fmt::Display for Vec<i32> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} items", self.len())
    }
}

fn main() {
    println!("{}", vec![1, 2, 3]);
}
