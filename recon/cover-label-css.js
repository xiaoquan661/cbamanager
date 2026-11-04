const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const keys = [".cover-label", ".cover-foot", ".cover-shop-heading", ".cover-recruit-cta", ".cover-tile{"];
for (const key of keys) {
  let i = -1, n = 0;
  while ((i = css.indexOf(key, i + 1)) >= 0 && n < 6) {
    const end = css.indexOf("}", i);
    console.log("\n" + key + " @" + i + "\n" + css.slice(i, Math.min(end + 1, i + 420)));
    n++;
  }
}
