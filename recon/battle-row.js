// battle-row.js — 比赛球场行组件 + ry 定义
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let r = js.indexOf("ry=[");
if (r < 0) r = js.indexOf("ry=");
console.log("ry 定义: " + js.slice(r, r + 200).replace(/\s+/g, " "));
// live-court 上下文
let l = js.indexOf("live-court");
console.log("\n== live-court 区域 ==");
console.log(js.slice(Math.max(0, l - 2200), l + 400).replace(/\s+/g, " "));
