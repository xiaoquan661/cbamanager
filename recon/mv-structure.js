// mv-structure.js — Mv 组件（我的球队分享区）完整结构 + InvitePage 模块起点
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// Mv 完整代码
let m = js.indexOf("function Mv({game:e,act:t,notify:n,onScout:r})");
console.log("== Mv 组件 ==");
console.log(js.slice(m, m + 2600).replace(/\s+/g, " "));
// InvitePage 模块 IIFE 起点：从 valid 函数往前找 })(window) 或模块注释
let v = js.indexOf("function valid(value){const code=normalize(value)");
console.log("\n== valid 前文 2500 字符（找模块边界） ==");
console.log(js.slice(Math.max(0, v - 2500), v).replace(/\s+/g, " ").slice(-1600));
