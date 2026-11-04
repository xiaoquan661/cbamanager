const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
const css = fs.readFileSync(root + "cba-startup.css", "utf8");
let i = js.indexOf("对手首发");
console.log("JS idx", i);
if (i >= 0) console.log(js.slice(Math.max(0, i - 900), i + 900).replace(/\s+/g, " "));
let j = css.indexOf("对手首发");
console.log("CSS idx", j);
if (j >= 0) console.log(css.slice(Math.max(0, j - 400), j + 600));
for (const key of ["journey-roster", "opponent", "roster-card", "opp-lineup"]) {
  let k = css.indexOf(key);
  if (k >= 0) console.log("\nCSS " + key + ": " + css.slice(Math.max(0, k - 200), k + 400).replace(/\s+/g, " "));
}
