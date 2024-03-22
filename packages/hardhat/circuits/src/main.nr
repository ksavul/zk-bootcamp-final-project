fn main(opcodes: [Field; 10]) -> pub bool{
    let f1: Field = 241;
    let s54: Field = 84;
    let s55: Field = 85;

    let mut last_opcode_found = 0;
    let mut found = false;
    
    for opcode in opcodes {
        if (last_opcode_found == 0) & (opcode == f1) {
            last_opcode_found = 1;
        } else if (last_opcode_found == 1) & (opcode == s54) {
            last_opcode_found = 2;
        } else if (last_opcode_found == 2) & (opcode == s55) {
          found = true;
        }
    }
    found
}

#[test]
fn test_main() {
    assert(main([23, 25, 57, 240, 81, 85, 99, 100, 102, 103]) == true);
}
