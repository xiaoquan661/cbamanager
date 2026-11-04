const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = -1, n = 0;
while ((i = js.indexOf("(Og,", i + 1)) >= 0 && n < 6) {
  console.log("\n--- usage", n, "@", i, "---");
  console.log(js.slice(Math.max(0, i - 300), i + 160));
  n++;
}
