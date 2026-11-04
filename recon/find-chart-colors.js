const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ['#f6f6f6', '#f5f6f7', '#828387', '#a17b7e']) {
  let i = -1, n = 0;
  console.log("\n### " + key + " count " + (js.split(key).length - 1));
  while ((i = js.indexOf(key, i + 1)) >= 0 && n < 4) {
    console.log("@" + i + ": " + js.slice(Math.max(0, i - 220), i + 160).replace(/\s+/g, " "));
    n++;
  }
}
