// iy-def.js — 找 iy 位置映射函数定义 + Ey 卡片组件的位置渲染
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// iy 定义
let i = js.indexOf("function iy(");
if (i < 0) { for (const m of js.matchAll(/\biy\s*=/g)) { console.log("iy= @" + m.index + ": " + js.slice(m.index, m.index + 300).replace(/\s+/g, " ")); } }
else console.log("function iy: " + js.slice(i, i + 400).replace(/\s+/g, " "));
// TP_POS 定义
let t = js.indexOf("TP_POS=");
console.log("\nTP_POS: " + js.slice(t, t + 200).replace(/\s+/g, " "));
// Ey 组件定义
let e = js.indexOf("function Ey(");
if (e < 0) e = js.indexOf("Ey=");
console.log("\nEy 组件: " + js.slice(e, e + 200).replace(/\s+/g, " "));
// Ey 里 position 渲染：在 Ey 组件范围内搜 position
let region = js.slice(e, e + 6000);
let p = region.indexOf("position");
console.log("\nEy 内 position 渲染: " + (p >= 0 ? region.slice(Math.max(0, p - 250), p + 250).replace(/\s+/g, " ") : "(6KB 内未找到)"));
