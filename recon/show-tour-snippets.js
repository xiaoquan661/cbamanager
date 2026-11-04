const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const k of ["const target = doc.querySelector", "rows.some(row =>"]) {
  const i = j.indexOf(k);
  console.log("\n### " + k + " @" + i);
  if (i >= 0) console.log(JSON.stringify(j.slice(i, i + 420)));
}