// poster-refs.js — 海报模块外部引用检查
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const m of ["CBA_HUPU_POST", "CBAResultPoster"]) {
  let i = 0, n = 0;
  console.log("== " + m + " ==");
  while ((i = js.indexOf(m, i)) >= 0 && n < 8) {
    console.log("@" + i + ": " + js.slice(Math.max(0, i - 120), i + 80).replace(/\s+/g, " "));
    i++; n++;
  }
}
