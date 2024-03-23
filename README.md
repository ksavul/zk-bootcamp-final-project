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
- `Verifier.toml` file that will contain the expected the input for the verifier program.

Now we need to fill the `Prover.toml` file with the public and private inputs, in our case the opcode from our contract.
Running `nargo prove` we will generate the proof in proof folder and it will automatically write in the `Verifier.toml` all the inputs that the verifier program will need to check the proof, in our case the solidity contract.

The way this works is that the prover program will generate a proof based on some bytecode that the verifier program will check if it is correct or not.
If we run `nargo verify` it will show if the proof is correct or not.

# Next steps

We have a problem here, all the inputs are public:
- the opcode sequence from the bytecodes
- the sequence of the vulnerability in the circuit (usually circuits are open source)

We need to find a way to make the inputs private, so the verifier program will not know the sequence of the vulnerability or the opcode sequence from the bytecode.

1. If we hide the opcode sequence from the bytecode, the prover program will be able to create a proof that she knows some bytecode that does not contain the vulnerability sequence. It can be a random bytecode and the verifier program will not know if the proof is correct or not.

2. If we hide the sequence of the vulnerability from the circuit, the prover program will be able to create a proof that she knows some vulnerability sequence that is not present in the circuit. It can be a random sequence and the verifier program will not know if the proof is correct or not.
However, the prover can create proofs with the same circuit that shows that known bytecode that contains the vulnerability are correctly detected.

In this other example we have a circuit that checks if the opcode sequence is present in the bytecode, but the sequence of the vulnerability is private.

```noir
fn main(opcodes: pub [Field; 843], dangerous_seq: [Field; 3]) -> pub bool{
    let mut last_opcode_found = 0;
    let mut found = false;
    
    for opcode in opcodes {
        if (last_opcode_found == 0) & (opcode == dangerous_seq[0]) {
            last_opcode_found = 1;
        } else if (last_opcode_found == 1) & (opcode == dangerous_seq[1]) {
            last_opcode_found = 2;
        } else if (last_opcode_found == 2) & (opcode == dangerous_seq[2]) {
          found = true;
        }
    }
    found
}
```