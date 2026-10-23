// ---
// topic: パターン
// answer: error
// explain: `match` は網羅的でなければなりません。`Direction::West` が漏れているので E0004
// (non-exhaustive patterns) です。
// ---
enum Direction {
    North,
    East,
    South,
    West,
}

fn main() {
    let d = Direction::North;
    let name = match d {
        Direction::North => "N",
        Direction::East => "E",
        Direction::South => "S",
    };
    println!("{name}");
}
