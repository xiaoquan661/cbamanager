const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
for (const k of ["新手引导", "引导", "公告", "首次", "免费签约", "seed", "starterPack", "welcome"]) {
  let i = -1, n = 0;
  console.log("\n### " + k + " (" + (j.split(k).length - 1) + ")");
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 3) {
    console.log(i + ": " + j.slice(Math.max(0, i - 200), i + 260).replace(/\s+/g, " "));
    n++;
  }
}