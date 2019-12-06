const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const spaceMap = [];

rl.on("line", function(cmd) {
  // do something;
  spaceMap.push(cmd);
});

rl.on("close", function() {
  universalOrbitMap(spaceMap);
  process.exit(0);
});

function universalOrbitMap(spaceMap) {
  // Build a hash map!
  const spaceSystem = {};

  spaceMap.forEach(path => {
    let planetOrbited;
    let planetOrbiting;
    let start = 0;

    for (let i = 0; i < path.length; i++) {
      if (path[i] === ")") {
        planetOrbited = path.slice(start, i);
        planetOrbiting = path.slice(i + 1);
        spaceSystem[planetOrbiting] = planetOrbited;
      }
    }
  });

  // Part 1: Find Total Orbits
  let totalOrbits = 0;

  for (let planet in spaceSystem) {
    let start = planet;

    while (spaceSystem[start]) {
      totalOrbits += 1;
      start = spaceSystem[start];
    }
  }

  console.log(`Total Orbits: ${totalOrbits}`);

  // Part 2: YOU Transfer to SAN
  const santaMap = {};
  let sanStart = spaceSystem["SAN"];
  santaMap[sanStart] = 0;

  while (spaceSystem[sanStart]) {
    santaMap[spaceSystem[sanStart]] = santaMap[sanStart] + 1;
    sanStart = spaceSystem[sanStart];
  }

  let youStart = spaceSystem["YOU"];
  let transfers = 0;

  while (spaceSystem[youStart]) {
    transfers += 1;
    if (santaMap[spaceSystem[youStart]]) {
      console.log(
        `Total Transfers: ${transfers + santaMap[spaceSystem[youStart]]}`
      );
      break;
    }
    youStart = spaceSystem[youStart];
  }
}
