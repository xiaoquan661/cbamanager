const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["tp-icon-rim", "tp-icon-pace", "tp-icon-high"]) {
  let i = css.indexOf(key);
  console.log("\n=== CSS", key, i, "===");
  if (i >= 0) console.log(css.slice(Math.max(0, i - 300), i + 700));
  let j = js.indexOf(key);
  console.log("=== JS", key, j, "===");
  if (j >= 0) console.log(js.slice(Math.max(0, j - 500), j + 500));
}
