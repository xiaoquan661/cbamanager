// hupu-final-check.js — 删除前的最后引用核查
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
for (const f of ["cba-startup.js", "cba-launch.js", "assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-daily-tasks.js", "assets/lamps/cba-rank-sync.js", "assets/lamps/cba-squad-share-r29.js"]) {
  const raw = fs.readFileSync(root + f, "utf8");
  const marks = ["__COLORBOX_AI_CONFIG__", "ColorboxAI.track", "ColorboxAI.context", "ColorboxAI.project", "ColorboxAI.hupuLog", "WebGuard", "hupuLog"];
  const hits = [];
  for (const m of marks) {
    let c = 0, i = 0;
    while ((i = raw.indexOf(m, i)) >= 0) { c++; i++; }
    if (c) hits.push(m + " x" + c);
  }
  console.log(f + ": " + (hits.join(" | ") || "(无引用)"));
}
// 海报模块边界探测：cba-poster 出现范围 + IIFE 起点
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
let min = Infinity, max = -1, i = 0;
while ((i = js.indexOf("cba-poster", i)) >= 0) { if (i < min) min = i; if (i > max) max = i; i++; }
console.log("\ncba-poster 范围: " + min + " ~ " + max);
// 模块起点：往前找最近的 IIFE 边界特征
for (const probe of [2320000, 2330000, 2335000, 2340000]) {
  console.log("@" + probe + ": " + js.slice(probe, probe + 120).replace(/\s+/g, " "));
}
// 邀请码 UI 入口还在吗
for (const m of ["请输入好友邀请码", "好友邀请码", "填写邀请码", "inviteRedeem", "redeem("]) {
  let c = 0, idx = js.indexOf(m);
  while (idx >= 0) { c++; idx = js.indexOf(m, idx + 1); }
  console.log("bundle 内 '" + m + "': " + c);
}
// 海报模块结尾探测
for (const probe of [2361500, 2362000, 2362500, 2363000]) {
  console.log("END @" + probe + ": " + js.slice(probe, probe + 120).replace(/\s+/g, " "));
}
