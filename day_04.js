const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input;

rl.on("line", function(cmd) {
  // Passed in input as given in AoC, split into array
  input = cmd.split("-");
});

rl.on("close", function() {
  console.log(validPasswords(input));
  process.exit(0);
});

function validPasswords(arr) {
  let numValidPasswordsPart1 = 0;
  let numValidPasswordsPart2 = 0;
  let start = Number(arr[0]);
  let end = Number(arr[1]);

  for (let i = start; i <= end; i++) {
    const current = i.toString();
    const checkIncrease = validateIncrease(current);

    if (checkIncrease && validateDoubles(current)) {
      numValidPasswordsPart1 += 1;
    }

    if (checkIncrease && validateDoublesWithMap(current)) {
      numValidPasswordsPart2 += 1;
    }
  }

  // Answers to Part 1 and Part 2 in array format
  return [numValidPasswordsPart1, numValidPasswordsPart2];
}

function validateIncrease(str) {
  for (let i = 1; i < str.length; i++) {
    if (str[i] < str[i - 1]) {
      return false;
    }
  }

  return true;
}

function validateDoubles(str) {
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      return true;
    }
  }

  return false;
}

function validateDoublesWithMap(str) {
  let numMap = {};

  for (let i = 0; i < str.length; i++) {
    // Build map with all chars from str
    if (!numMap.hasOwnProperty(str[i])) {
      numMap[str[i]] = 0;
    }
    numMap[str[i]] += 1;
  }

  for (let num in numMap) {
    // there exists one double outside of a larger group of matching digits
    if (numMap[num] / 2 === 1) {
      return true;
    }
  }

  return false;
}
