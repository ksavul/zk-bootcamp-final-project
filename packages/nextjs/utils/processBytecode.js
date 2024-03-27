export default function splitBytecodeAtJumps(bytecode) {
  bytecode = filterOpcodes(bytecode.toLowerCase());

  const jumpOpcodes = ["56", "57"];

  let segmentStartIndexes = [0];
  for (let i = 0; i < bytecode.length; i += 2) {
    const opcode = bytecode.substring(i, i + 2);
    if (jumpOpcodes.includes(opcode)) {
      segmentStartIndexes.push(i + 2);
    }
  }

  let segments = [];
  for (let i = 0; i < segmentStartIndexes.length; i++) {
    const start = segmentStartIndexes[i];
    const end = segmentStartIndexes[i + 1] || bytecode.length;
    segments.push(bytecode.substring(start, end));
  }

  return segments.filter((value) => value !== "");
}

//Filters bytecode so only opcodes are left (data is removed)
function filterOpcodes(bytecode) {
  const opcodeLengths = {
    60: 2, // PUSH1
    61: 3,
    62: 4,
    63: 5,
    64: 6,
    65: 7,
    66: 8,
    67: 9,
    68: 10,
    69: 11,
    "6a": 12,
    "6b": 13,
    "6c": 14,
    "6d": 15,
    "6e": 16,
    "6f": 17,
    70: 18,
    71: 19,
    72: 20,
    73: 21,
    74: 22,
    75: 23,
    76: 24,
    77: 25,
    78: 26,
    79: 27,
    "7a": 28,
    "7b": 29,
    "7c": 30,
    "7d": 31,
    "7e": 32,
    "7f": 33,
  };

  let opcodes = [];
  for (let i = 0; i < bytecode.length; i += 2) {
    const opcode = bytecode.substring(i, i + 2).toLowerCase();
    opcodes.push(opcode);

    if (opcode in opcodeLengths) {
      const bytesToSkip = opcodeLengths[opcode] - 1;
      i += bytesToSkip * 2;
    }
  }

  return opcodes.join("");
}
