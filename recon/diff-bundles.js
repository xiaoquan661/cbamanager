// diff-bundles.js — 对比原版新旧两个 bundle，提取新增/消失的玩法文案
const fs = require("fs");
const old_ = fs.readFileSync("C:/10.19源码/_原始备份/CBA梦幻经理-原版完整备份/cba-startup.js", "utf8");
const neu = fs.readFileSync("C:/10.19源码/CBA梦幻经理/cba-startup.js", "utf8");

function modules(src) {
  const m = src.match(/\/\* [a-z0-9-]+\.js \*\//g) || [];
  return m.map((s) => s.replace(/\*|\//g, "").trim());
}
const mo = modules(old_), mn = modules(neu);
console.log("=== 旧版模块:", mo.length, "| 新版模块:", mn.length, "===");
console.log("新版新增模块:", mn.filter((x) => !mo.includes(x)).join(", ") || "(无)");
console.log("旧版移除模块:", mo.filter((x) => !mn.includes(x)).join(", ") || "(无)");

function zh(src) {
  const s = new Set();
  const m = src.match(/[\u4e00-\u9fa5][\u4e00-\u9fa5·、，。！？“”：《》（）0-9a-zA-Z]{5,}/g) || [];
  m.forEach((x) => s.add(x));
  return s;
}
const so = zh(old_), sn = zh(neu);
const added = [...sn].filter((x) => !so.has(x));
const removed = [...so].filter((x) => !sn.has(x));
console.log("=== 新增文案:", added.length, "条 | 消失文案:", removed.length, "条 ===");
console.log("--- 新增文案（前 100 条）---");
console.log(added.slice(0, 100).join("\n"));
console.log("--- 消失文案（前 30 条）---");
console.log(removed.slice(0, 30).join("\n"));
