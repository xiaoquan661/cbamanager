const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
for (const k of ['openingCoins', "OPENING_COINS"]) {
  let i = -1, n = 0;
  console.log("### " + k);
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 10) {
    console.log(i, j.slice(Math.max(0, i - 100), i + 100).replace(/\s+/g, " "));
    n++;
  }
}