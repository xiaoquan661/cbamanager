const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = j.indexOf("cba-679408");
console.log("cba-679408 at", i);
console.log(j.slice(Math.max(0, i - 300), i + 300).replace(/\s+/g, " "));
console.log("\n--- practiceCheckin ---");
i = j.indexOf("practiceCheckin");
console.log(j.slice(Math.max(0, i - 200), i + 200).replace(/\s+/g, " "));
console.log("\n--- any state-like JSON ---");
for (const k of ['"lineup":', '"cards":[{"uid"', '"openingGranted"']) {
  console.log(k, (j.split(k).length - 1));
}