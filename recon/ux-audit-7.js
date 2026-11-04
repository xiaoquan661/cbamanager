// ux-audit-7.js — 预测提交后的反馈 + 页面切换过渡 + 阵容换人交互
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");

// 1. 预测提交的引擎反馈（result 文案）
let i = js.indexOf("预测已提交");
if (i < 0) i = js.indexOf("下注");
console.log("== 预测反馈文案 ==");
let s = 0, n = 0;
while ((i = js.indexOf("预测", s)) >= 0 && n < 6) {
  s = i + 1;
  if (i < 400000 || i > 3300000) continue;
  const ctx = js.slice(Math.max(0, i - 120), i + 120).replace(/\s+/g, " ");
  if (/result|title|message|notice/.test(ctx)) { console.log("@" + i + ": " + ctx.slice(0, 240)); n++; }
}

// 2. 页面切换过渡
console.log("\n== 页面过渡 ==");
console.log("page-enter/fade 类: " + (["page-enter", "page-fade", "route-fade", "screen-enter"].map(k => k + "=" + css.includes(k)).join(" ")));
console.log("keyframes 含 page/route/fade: " + ((css.match(/@keyframes [^{]*(page|route|fade)[^{]*/g) || []).join(", ") || "无"));

// 3. 阵容点击换人（j(t) 后的选择器）
let j = js.indexOf("vacant-card");
console.log("\n== 阵容换人/选择器 ==");
console.log(js.slice(Math.max(0, j - 100), j + 300).replace(/\s+/g, " "));

// 4. 拖拽是否支持触屏
console.log("\n== 触屏拖拽 ==");
console.log("pointer* + court: " + (js.match(/pointerdown[\s\S]{0,200}court/g) ? "有" : "未发现"));
console.log("touch* + drag: " + (js.match(/touch(start|move)[\s\S]{0,200}(drag|swap|lineup)/g) ? "有" : "未发现"));