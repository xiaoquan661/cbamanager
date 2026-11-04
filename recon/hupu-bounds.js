// hupu-bounds.js — 精确定位海报模块与邀请码 UI 的边界
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// 1. 海报模块起点（2341200-2341700）
console.log("== 海报起点区域 ==");
console.log(js.slice(2341100, 2341700).replace(/\s+/g, " "));
// 2. 海报模块终点（2361400-2362100）
console.log("\n== 海报终点区域 ==");
console.log(js.slice(2361400, 2362100).replace(/\s+/g, " "));
// 3. 邀请码 UI 入口（填写邀请码）
let i = js.indexOf("填写邀请码");
console.log("\n== 填写邀请码 入口 ==");
console.log(js.slice(Math.max(0, i - 700), i + 300).replace(/\s+/g, " "));
