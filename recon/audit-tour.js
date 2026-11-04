const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const k of ["熟悉主页", "cba-home-tour", "homeTour", "下一步", "跳过引导"]) {
  let i = -1, n = 0;
  console.log("\n### " + k + " (" + (j.split(k).length - 1) + ")");
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 4) {
    console.log(i + ": " + j.slice(Math.max(0, i - 500), i + 500).replace(/\s+/g, " "));
    n++;
  }
}