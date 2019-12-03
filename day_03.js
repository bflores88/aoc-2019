const readline = require("readline");

const inputs = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", function(cmd) {
  // something
  inputs.push(cmd.split(","));
});

rl.on("close", function() {
  // something
  findIntersection(inputs);
  process.exit(0);
});

function findIntersection(arr) {
  const line1 = arr[0];
  const line2 = arr[1];

  const lineMap = {};
  let minManhattanDistance = Number.MAX_VALUE;
  let minSteps = Number.MAX_VALUE;

  // loop through line1 and build hash map of all coordinates traversed
  let line1start = [0, 0];
  let line1steps = [0];
  for (let i = 0; i < line1.length; i++) {
    const direction = line1[i][0];
    const traversal = Number(line1[i].substring(1));

    traversalHelper(direction, traversal, line1start, lineMap, line1steps);
  }

  // loop through line2 and check if coordinates exist in the map
  let line2start = [0, 0];
  let line2steps = 0;
  for (let j = 0; j < line2.length; j++) {
    const direction = line2[j][0];
    const traversal = Number(line2[j].substring(1));

    for (let k = 0; k < traversal; k++) {
      switch (direction) {
        case "U":
          line2start[1] += 1;
          break;
        case "D":
          line2start[1] -= 1;
          break;
        case "R":
          line2start[0] += 1;
          break;
        default:
          line2start[0] -= 1;
          break;
      }

      line2steps += 1;

      if (lineMap[line2start]) {
        minManhattanDistance = Math.min(
          minManhattanDistance,
          lineMap[line2start][0]
        );

        minSteps = Math.min(minSteps, lineMap[line2start][1] + line2steps);
      }
    }
  }

  // Answer to part 1
  console.log(minManhattanDistance);

  // Answer to part 2
  console.log(minSteps);
}

function traversalHelper(direction, traversal, coordinate, map, steps) {
  for (let i = 0; i < traversal; i++) {
    switch (direction) {
      case "U":
        coordinate[1] += 1;
        break;
      case "D":
        coordinate[1] -= 1;
        break;
      case "R":
        coordinate[0] += 1;
        break;
      default:
        coordinate[0] -= 1;
        break;
    }

    steps[0] += 1;

    if (!map[coordinate]) {
      map[coordinate] = [
        Math.abs(coordinate[0]) + Math.abs(coordinate[1]),
        steps[0]
      ];
    }
  }
}
