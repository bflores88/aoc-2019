const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let puzzleInput = null;
const inputs = [];

rl.on("line", function(cmd) {
  if (!puzzleInput) {
    puzzleInput = cmd.split(",").map(Number);
    decoder(puzzleInput, inputs);
  } else {
    if (inputs.length > 0) {
      console.log(`Replacing address ${inputs[0]} with ${Number(cmd)}`);
      puzzleInput[inputs[0]] = Number(cmd);
      inputs.splice(0, 1);
      decoder(puzzleInput, inputs);
    }
  }

  if (inputs.length > 0) {
    console.log(inputs);
    console.log(`Please enter the following # of inputs: ${inputs.length}`);
  }
});

rl.on("close", function() {
  process.exit(0);
});

function initialDecode() {
  let idx = 0;
  let output = 0;

  return function scanDecoder(intcode, inputs) {
    while (idx < intcode.length) {
      if (intcode[idx] === 99) break;
      const codex = reverseDigits(intcode[idx]);
      const opCode = codex[0];

      switch (opCode) {
        // Add
        case 1:
          const a1 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b1 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];

          intcode[intcode[idx + 3]] = a1 + b1;
          idx += 4;
          break;

        // Multiply
        case 2:
          const a2 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b2 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];

          intcode[intcode[idx + 3]] = a2 * b2;
          idx += 4;
          break;

        // Input
        case 3:
          const positionToBeChanged = intcode[idx + 1];
          inputs.push(positionToBeChanged);
          idx += 2;
          break;

        // Output
        case 4:
          console.log(
            `OUTPUT: + ${
              codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]]
            }`
          );
          output =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          idx += 2;
          break;

        // Jump-if-true
        case 5:
          const a5 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b5 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];
          if (a5 !== 0) {
            idx = b5;
          } else {
            idx += 3;
          }
          break;

        // Jump-if-false
        case 6:
          const a6 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b6 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];
          if (a6 === 0) {
            idx = b6;
          } else {
            idx += 3;
          }
          break;

        // Less than
        case 7:
          const a7 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b7 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];
          if (a7 < b7) {
            intcode[intcode[idx + 3]] = 1;
          } else {
            intcode[intcode[idx + 3]] = 0;
          }
          idx += 4;
          break;

        // Equals
        case 8:
          const a8 =
            codex[1] === 1 ? intcode[idx + 1] : intcode[intcode[idx + 1]];
          const b8 =
            codex[2] === 1 ? intcode[idx + 2] : intcode[intcode[idx + 2]];
          if (a8 === b8) {
            intcode[intcode[idx + 3]] = 1;
          } else {
            intcode[intcode[idx + 3]] = 0;
          }
          idx += 4;
          break;

        default:
          console.log(
            `ERROR: Unknown code at index ${idx} with opCode ${opCode}`
          );
          loop = false;
          return;
      }

      if (opCode === 3) break;
    }
  };
}

var decoder = initialDecode();

function reverseDigits(n) {
  if (n === 0) return 0;
  digits = [];

  // Push opCode into 0 index
  digits.push(n % 10);

  let a = n.toString().slice(0, -2);

  while (a > 0) {
    digits.push(a % 10);
    a = Math.floor(a / 10);
  }

  return digits;
}
