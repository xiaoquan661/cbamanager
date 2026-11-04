const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
for (const key of [".tp-icon{", ".tp-icon ", "aria-pressed", "tactic-pick", ".tp-card", "tp-option"]) {
  let i = -1, n = 0;
  while ((i = css.indexOf(key, i + 1)) >= 0 && n < 4) {
    console.log("\n=== " + key + " @ " + i + " ===");
    console.log(css.slice(Math.max(0, i - 150), i + 450));
    n++;
  }
}
