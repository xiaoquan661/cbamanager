// anchor-exact.js — 取签名/预测两处精确字节
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("setSelectedSlot(null)");
while (i >= 0) {
  const ctx = js.slice(Math.max(0, i - 120), i + 200);
  if (/accepted|signPlayer/.test(ctx)) { console.log("=== 签约 ==="); console.log(JSON.stringify(ctx)); break; }
  i = js.indexOf("setSelectedSlot(null)", i + 1);
}
let j = js.indexOf("type: 'predict'");
console.log("\n=== 预测 ===");
console.log(JSON.stringify(js.slice(Math.max(0, j - 260), j + 420)));