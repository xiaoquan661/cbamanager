// arena-stats.js — 比赛模拟的球员数据聚合（事件类型 + oe 得分表）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");

// 1. 事件类型清单（v.kind=）
const kinds = new Set();
for (const m of js.matchAll(/(?:v|event|ev)\.kind\s*=\s*`([a-z]+)`/g)) kinds.add(m[1]);
console.log("事件 kind:", [...kinds].join(", "));

// 2. arena 区域的 oe 得分表定义
const seg = js.slice(3281000, 3286000);
let i = seg.indexOf("oe");
// 往前找 oe= 定义（3270000-3285000）
const wide = js.slice(3268000, 3282447);
let j = wide.lastIndexOf("oe=");
console.log("\noe= @" + (3268000 + j));
console.log(js.slice(3268000 + j - 300, 3268000 + j + 700).replace(/\s+/g, " "));
