const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const k of ["storageKey", "home-tour", "homeTourSeen", "seen-home", "25-home", "tour:"]) {
  let i = -1, n = 0;
  console.log("\n### " + k);
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 5) {
    console.log(i + ": " + j.slice(Math.max(0, i - 220), i + 220).replace(/\s+/g, " "));
    n++;
  }
}