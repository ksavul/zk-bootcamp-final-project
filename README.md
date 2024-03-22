Install nargo 

- curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash

- noirup

use this vscode extension: noir-lang.vscode-noir

- nargo check

- nargo prove

- nargo verify (will show errors if proof fails)

# Create Solidity contract verifier

nargo codegen-verifier

# First proof of concept

I have created a opcode sequence checker that checks if the sequence of a (possible) vulnerability is present in the array or not.
Reentrancy sequence here is [241, 84, 85]

```noir
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
```

First we run `nargo check` to check if the code is correct or not.
That creates:
- `Prover.toml` file which contains the public inputs and the private inputs.
- `Verifier.toml` file which contains the public output of the function, in this case a boolean value. True if the sequence is found, false otherwise.
Then we run `nargo prove` to create a proof, this command will fill the `Verifier.toml` file with the expected output.

The way this works is that users have access to the public input and the expected output (in `Verifier.toml` file). They can use a Verifier program to check that the proof is correct given the public input and the expected output.
