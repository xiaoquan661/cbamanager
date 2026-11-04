const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["cba-reward-watch", "cba-rewards-heading", "page-rewards", "返回"]) {
  let i = -1, n = 0;
  console.log("\n##### " + key);
  while ((i = css.indexOf(key, i + 1)) >= 0 && n < 6) {
    const s = Math.max(0, i - 180), e = Math.min(css.length, i + 420);
    console.log("CSS @" + i + ": " + css.slice(s, e).replace(/\s+/g, " "));
    n++;
  }
  let j = -1; n = 0;
  while ((j = js.indexOf(key, j + 1)) >= 0 && n < 4) {
    const s = Math.max(0, j - 160), e = Math.min(js.length, j + 260);
    console.log("JS @" + j + ": " + js.slice(s, e).replace(/\s+/g, " "));
    n++;
  }
}
