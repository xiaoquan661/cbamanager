const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
// find definition of I_
let i = j.indexOf("function I_(");
console.log("I_ def at", i);
if (i >= 0) console.log(j.slice(i, i + 1200).replace(/\s+/g, " "));
// find schedule/opponent order
for (const k of ["function iv(", "function f_(", "trainingOpponents", "opponents", "teamsOrder"]) {
  let idx = j.indexOf(k);
  console.log("\n### " + k + " at " + idx);
  if (idx >= 0) console.log(j.slice(idx, idx + 900).replace(/\s+/g, " "));
}