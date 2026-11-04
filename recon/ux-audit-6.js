// ux-audit-6.js — Predictions 交互（提交/反馈/动画类名）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log("===== Predictions 主体 =====");
console.log(js.slice(2218340, 2225600).replace(/\s+/g, " "));