// battle-row2.js — 比赛行渲染全文（3282000-3283200）+ 本模块 ry 定义
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log(js.slice(3281900, 3283200).replace(/\s+/g, " "));
// 往前找 ry= 定义（3270000-3282447 之间）
const seg = js.slice(3260000, 3282447);
const r = seg.lastIndexOf("ry=");
console.log("\n== 本模块 ry= @" + (3260000 + r) + " ==");
console.log(js.slice(3260000 + r - 150, 3260000 + r + 250).replace(/\s+/g, " "));
