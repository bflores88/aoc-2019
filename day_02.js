const readline = require("readline");

let puzzleInput = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", function(cmd) {
  puzzleInput = cmd.split(",").map(x => Number(x));
});

rl.on("close", function() {
  // Answer for Part 1
  console.log(programAlarm(puzzleInput));

  // Answer for Part 2
  console.log(findNounAndVerb(puzzleInput, 5354));
  process.exit(0);
});

function programAlarm(array, noun = 12, verb = 2) {
  let arr = [...array];
  let add = false;
  let multiply = false;
  let num1 = null;
  let num2 = null;

  arr[1] = noun;
  arr[2] = verb;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];

    // determine add or multiply
    if (!add && !multiply) {
      if (num === 1) add = true;
      if (num === 2) multiply = true;
      if (num === 99) break;
      continue;
    }

    // add or multiply is set, so set first number
    if (num1 === null) {
      num1 = arr[num];
      continue;
    }

    // set second number
    if (num2 === null) {
      num2 = arr[num];
      continue;
    }

    // nums are set, so calculate & set into position
    if (add) {
      arr[num] = num1 + num2;
      add = false;
    } else {
      arr[num] = num1 * num2;
      multiply = false;
    }

    // reset the variables;
    num1 = null;
    num2 = null;
  }

  return arr[0];
}

function findNounAndVerb(array, outcome) {
  for (let i = 0; i <= 99; i++) {
    let noun = i;
    for (let j = 0; j <= 99; j++) {
      let verb = j;
      let output = programAlarm(array, noun, verb);

      if (output === outcome) {
        return 100 * noun + verb;
      }
    }
  }
  // no combination of noun and verb within range 0-99 returns the outcome
  return false;
}
