// invite-structure.js — 邀请码模块结构分析
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = 0;
const hits = [];
while ((i = js.indexOf("redeem", i)) >= 0) { hits.push(i); i++; }
console.log("redeem 出现位置:", hits.join(", "));
for (const h of hits) {
  console.log("\n--- @" + h + " ---");
  console.log(js.slice(Math.max(0, h - 200), h + 120).replace(/\s+/g, " "));
}
// 邀请码函数簇的起点（valid/normalize 定义处）
let j = js.indexOf("function validate(code,state)");
console.log("\nvalidate 前文（找函数簇起点）:");
console.log(js.slice(Math.max(0, j - 1200), j).replace(/\s+/g, " ").slice(-900));
