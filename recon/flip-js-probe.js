// flip-js-probe.js — freshReveal / just-revealed / is-opening 在 JS 中的使用
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const m of ["freshReveal", "just-revealed", "is-opening", "fantasy-flip "]) {
  let i = js.indexOf(m), n = 0;
  console.log("\n== " + m + " x" + (js.split(m).length - 1) + " ==");
  while (i >= 0 && n < 6) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - 180), i + 180).replace(/\s+/g, " ").slice(0, 340));
    i = js.indexOf(m, i + 1); n++;
  }
}