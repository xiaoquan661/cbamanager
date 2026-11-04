// outcome-probe.js — 结算页胜负头部文案与类名
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const m of ["KEEP FIGHTING", "重整阵容", "擦挫", "再战主场", "arena-outcome", "arena-result-content"]) {
  let i = js.indexOf(m), n = 0;
  console.log("\n== " + m + " x" + (js.split(m).length - 1) + " ==");
  while (i >= 0 && n < 3) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - 300), i + 300).replace(/\s+/g, " ").slice(0, 560));
    i = js.indexOf(m, i + 1); n++;
  }
}