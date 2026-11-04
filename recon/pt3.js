// pt3.js — PersonTile 三处出现全文
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let s = 0, i;
while ((i = js.indexOf("PersonTile", s)) >= 0) {
  console.log("=== @" + i + " ===");
  console.log(js.slice(Math.max(0, i - 300), i + 400).replace(/\s+/g, " ").slice(0, 650) + "\n");
  s = i + 1;
}
