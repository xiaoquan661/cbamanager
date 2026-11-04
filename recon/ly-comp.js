// ly-comp.js — ly 头像组件（tp 战术面板的球员卡）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("function ly(");
if (i < 0) { // 找 ly= 定义
  for (const m of js.matchAll(/\bly\s*=/g)) { console.log("ly= @" + m.index + ": " + js.slice(m.index, m.index + 120).replace(/\s+/g, " ")); }
}
if (i >= 0) console.log(js.slice(i, i + 1800).replace(/\s+/g, " "));
// tp-position 完整渲染区域
let t = js.indexOf("tp-position tp-spot-");
console.log("\n== tp 区域全文 ==");
console.log(js.slice(t - 1500, t + 1600).replace(/\s+/g, " "));
