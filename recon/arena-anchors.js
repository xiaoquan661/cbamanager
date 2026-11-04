// arena-anchors.js — 取得分表构建 + 卡片得分渲染的精确字节
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("oe=new Map");
console.log("=== 得分表构建 ===");
console.log(JSON.stringify(js.slice(i, i + 140)));
let j = js.indexOf("oe.get(t+`:`+e.id)");
console.log("\n=== 卡片得分渲染 ===");
console.log(JSON.stringify(js.slice(j - 120, j + 90)));
