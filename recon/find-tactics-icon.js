const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const anchor = "M13.9 0.499976";
let i = js.indexOf(anchor), n = 0;
console.log("magic-wand path count:", js.split(anchor).length - 1);
if (i >= 0) {
  console.log("--- context ---");
  console.log(js.slice(i - 1400, i + 900));
}
const t = js.indexOf("战术调整");
console.log("\n战术调整 at", t);
console.log(js.slice(t - 1200, t + 200));
