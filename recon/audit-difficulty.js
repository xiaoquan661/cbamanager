const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
for (const k of ["opponentPower", "opponentTeam", "strength", "opponent", "roundIndex", "matchIndex", "lineupPower", "startingPower"]) {
  let i = -1, n = 0;
  console.log("\n### " + k + " (" + (j.split(k).length - 1) + ")");
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 4) {
    console.log(i + ": " + j.slice(Math.max(0, i - 180), i + 220).replace(/\s+/g, " "));
    n++;
  }
}