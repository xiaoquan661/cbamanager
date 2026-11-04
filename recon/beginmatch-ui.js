// beginmatch-ui.js — UI 侧 beginMatch 调用点 + 结果页 footer 全文
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let s = 0, i, n = 0;
while ((i = js.indexOf("beginMatch`", s)) >= 0 && n < 8) {
  s = i + 1;
  console.log("--- beginMatch` @" + i + " ---");
  console.log(js.slice(Math.max(0, i - 400), i + 300).replace(/\s+/g, " ").slice(0, 620) + "\n");
  n++;
}
// footer 全文（3285000-3285700）
console.log("\n== arena footer ==");
console.log(js.slice(3285000, 3285800).replace(/\s+/g, " "));