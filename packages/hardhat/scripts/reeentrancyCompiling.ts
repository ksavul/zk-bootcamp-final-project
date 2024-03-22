import { readFileSync , writeFileSync} from 'fs';
import path from 'path';
import solc from 'solc';
import { config as dotenvConfig } from 'dotenv';
import { Transaction } from 'ethers';

dotenvConfig();
const bytecodestring = readFileSync(path.join(__dirname, 'bytecode.txt'), 'utf8');


async function main() {
    // Define the source code as a string
    const sourceCode = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract ReentrancyVulnerable {
        mapping(address => uint256) public balances;

        function deposit() public payable {
            balances[msg.sender] += msg.value;
        }

        function withdraw(uint256 _amount) public {
            require(balances[msg.sender] >= _amount, "Insufficient balance");
            (bool sent, ) = msg.sender.call{value: _amount}("");
            require(sent, "Failed to send Ether");
            balances[msg.sender] -= _amount;
        }

        receive() external payable {}
    }
    `;

    // Compile the source code
    const input = {
        language: 'Solidity',
        sources: {
            'ReentrancyVulnerable.sol': {
                content: sourceCode,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Handle and print errors
    if (!output || !output.contracts || !output.contracts['ReentrancyVulnerable.sol']) {
        console.error("Compilation failed or contract not found in output.");
        if (output.errors) {
            output.errors.forEach((err: any) => {
                console.error(err.formattedMessage);
            });
        }
        process.exit(1);
    }

    const bytecode = output.contracts['ReentrancyVulnerable.sol']['ReentrancyVulnerable'].evm.bytecode.object;
    // const disassembled = disassemble(bytecode);
    console.log("Bytecode:", bytecode);
    // console.log(bytecodestring);
    console.log("Disassembled:", parseOpcodes(bytecode));
}

function parseOpcodes(bytecode: string): string[] {
    let index = 0;
    const opcodes: any = [];

    while (index < bytecode.length) {
        let opcode = bytecode.substring(index, index + 2);
        // convert the opcode to a decimal number
        opcodes.push(opcode);
        index += 2;

        // If it's a PUSH opcode, skip the corresponding bytes
        if (opcode >= '60' && opcode <= '7f') {
            const bytesToSkip = parseInt(opcode, 16) - 0x5f;
            index += bytesToSkip * 2;
        }
    }

    console.log(opcodes.length);

    // convert all the opcodes to a decimal number
    for (let i = 0; i < opcodes.length; i++) {
        opcodes[i] = parseInt(opcodes[i], 16);
    }

    // save the opcodes to a file
    writeFileSync(path.join(__dirname, 'bytecode.txt'), 'opcodes=[' + opcodes.join(',') + ']');

    return opcodes;
}

function disassemble(bytecode) {
    // const opcodes = ethers.utils.parseTransaction({ data: bytecode }).data;
    // return ethers.utils.formatBytes32String(opcodes);
    const transaction = Transaction.from(bytecode);
    return transaction;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
