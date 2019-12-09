const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let puzzleInput = null;
let phaseSettings = null;
const initialInput = 0;

process.stdout.write(`Enter puzzle input.\n`);

rl.on("line", function(cmd) {
  if (!puzzleInput) {
    puzzleInput = cmd.split(",").map(Number);
    // process.stdout.write(`Enter phase settings.\n`);
  } else {
    phaseSettings = cmd.split(",").map(Number);
    amplifier(puzzleInput, initialInput, phaseSettings);
  }
});

rl.on("close", function() {
  findMaxThrusterSignal(puzzleInput, initialInput);
  process.exit(0);
});

function generateAllPhaseSettings(settingOptions) {
  const allPhaseSettings = [];

  function createPhaseSetting(currentSettings, settingOptions) {
    if (settingOptions.length === 0) {
      allPhaseSettings.push(currentSettings);
      return;
    }

    for (let i = 0; i < settingOptions.length; i++) {
      createPhaseSetting(
        [...currentSettings, settingOptions[i]],
        [
          ...settingOptions.slice(0, i),
          ...settingOptions.slice(i + 1, settingOptions.length)
        ]
      );
    }
  }

  createPhaseSetting([], settingOptions);

  return allPhaseSettings;
}

function findMaxThrusterSignal(puzzleInput, initialInput) {
  let maxSignal = Number.MIN_VALUE;

  const allPhaseSettings = generateAllPhaseSettings([0, 1, 2, 3, 4]);

  allPhaseSettings.forEach(phaseSetting => {
    maxSignal = Math.max(
      maxSignal,
      amplifier(puzzleInput, initialInput, phaseSetting)
    );
  });

  console.log(`Max Signal: ${maxSignal}`);

  return maxSignal;
}

function amplifier(puzzleInput, initialInput, phaseSettings) {
  const amplifiers = ["A", "B", "C", "D", "E"];
  let ampIndex = 0;
  let amplifierOutput = null;

  while (ampIndex < amplifiers.length) {
    console.log(
      `Processing Amplifier ${amplifiers[ampIndex]} with Phase Setting ${phaseSettings[ampIndex]}`
    );
    console.log(`Previous amplifier output is ${amplifierOutput}`);
    const currentPhaseSetting = phaseSettings[ampIndex];
    let decoder = initialDecode();
    let thisOutput = decoder(
      puzzleInput,
      initialInput,
      currentPhaseSetting,
      amplifierOutput
    );

    console.log(
      `Output for Amplifier ${amplifiers[ampIndex]} is ${thisOutput}`
    );

    amplifierOutput = thisOutput;

    ampIndex += 1;
  }

  return amplifierOutput;
}

function initialDecode() {
  let idx = 0;
  let output = 0;
  let phaseSettingSet = false;

  return function scanDecoder(
    intcode,
    initialInput,
    phaseSetting,
    previousAmpOutput
  ) {
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
          if (!phaseSettingSet) {
            intcode[positionToBeChanged] = phaseSetting;
            phaseSettingSet = true;
            console.log(`Set phase settings to ${phaseSetting}`);
          } else if (previousAmpOutput !== null) {
            intcode[positionToBeChanged] = previousAmpOutput;
            console.log(
              `Set input to Previous Amp Output at ${previousAmpOutput}`
            );
          } else {
            intcode[positionToBeChanged] = initialInput;
            console.log(`Set input to initial input at ${initialInput}`);
          }
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
          return output;

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
    }

    return output;
  };
}

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
