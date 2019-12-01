const readline = require("readline");

let totalFuel = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", function(cmd) {
  const fuel = getFuel(cmd);
  totalFuel += fuel;
});

rl.on("close", function() {
  console.log(totalFuel);
  process.exit(0);
});

function getFuel(mass, total = 0) {
  mass = Math.floor(Number.parseInt(mass) / 3) - 2;

  if (mass <= 0) {
    return total;
  }

  return getFuel(mass, total + mass);
}
