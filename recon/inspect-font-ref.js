const fs = require("fs");
const c = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
for (const k of ["asset-276", "asset-277", "资源_2MB"]) {
  let i = -1, n = 0;
  console.log("### " + k);
  while ((i = c.indexOf(k, i + 1)) >= 0 && n < 3) {
    console.log(c.slice(Math.max(0, i - 160), i + 80).replace(/\s+/g, " "));
    n++;
  }
}