// arena-props.js — ay 组件调用点（props）+ 内部 i/E/S 定义
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("(0,D.jsx)(ay,{match:xe");
console.log("== ay 调用点 ==");
console.log(js.slice(i, i + 900).replace(/\s+/g, " "));
// arena 组件签名
let s = js.indexOf("function ay(");
if (s < 0) s = js.indexOf("ay=(");
console.log("\n== ay 定义 ==");
console.log(js.slice(s, s + 400).replace(/\s+/g, " "));
// 内部 i 定义（onCampaign 之类）
for (const m of ["onCampaign", "onLeave"]) {
  let c = js.indexOf(m), n = 0;
  console.log("\n== " + m + " ==");
  while (c >= 0 && n < 4) {
    console.log("@" + c + ": " + js.slice(Math.max(0, c - 100), c + 120).replace(/\s+/g, " "));
    c = js.indexOf(m, c + 1); n++;
  }
}