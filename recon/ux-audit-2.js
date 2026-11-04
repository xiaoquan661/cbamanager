// ux-audit-2.js — Shop/Predictions 组件体（找交互处理与反馈）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log("===== Shop 组件（切片1） =====");
console.log(js.slice(2198130, 2203500).replace(/\s+/g, " "));