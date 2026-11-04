const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const k of ["1280", "128", "coins+=", "coins +=", "coins:", "grant", "signup", "welcomeCoins"]) {
  let i = -1, n = 0;
  console.log("\n### " + k + " (" + (j.split(k).length - 1) + ")");
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 6) {
    console.log(i + ": " + j.slice(Math.max(0, i - 180), i + 180).replace(/\s+/g, " "));
    n++;
  }
}