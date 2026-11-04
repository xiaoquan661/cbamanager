// ux-audit-8.js — 引擎 predict 分支是否有 result 反馈；arena skip 按钮存在与否
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let s = 0, i, n = 0;
while ((i = js.indexOf("predict`", s)) >= 0 && n < 8) {
  s = i + 1;
  if (i < 400000 || i > 3300000) continue;
  const ctx = js.slice(Math.max(0, i - 200), i + 400).replace(/\s+/g, " ");
  if (/result|Q_|reduce|dispatch/.test(ctx)) { console.log("@" + i + ": " + ctx.slice(0, 560) + "\n"); n++; }
}
console.log("arena-skip 出现: " + (js.split("arena-skip").length - 1));
let k = js.indexOf("arena-skip");
if (k >= 0) console.log(js.slice(Math.max(0, k - 200), k + 300).replace(/\s+/g, " "));