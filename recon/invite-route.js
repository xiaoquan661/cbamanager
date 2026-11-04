// invite-route.js — InvitePage 路由入口 + 模块起点
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// CBAInviteUI 的使用处
let i = 0;
while ((i = js.indexOf("CBAInviteUI", i)) >= 0) {
  console.log("--- CBAInviteUI @" + i + " ---");
  console.log(js.slice(Math.max(0, i - 260), i + 160).replace(/\s+/g, " ").slice(0, 380));
  i++;
}
// InvitePage 模块起点：找模块注释/IIFE 开头（root.CBAInviteUI 结尾在 2279231 附近）
const endMark = "root.CBAInviteUI={create,redeem,normalize,valid};})(window);";
const end = js.indexOf(endMark);
console.log("\n模块结尾 @" + end);
// 往前找模块开始注释
const seg = js.slice(2250000, end);
const cIdx = seg.lastIndexOf("/* cba-");
console.log("模块起点注释: @" + (2250000 + cIdx) + " → " + js.slice(2250000 + cIdx, 2250000 + cIdx + 60));
console.log("起点前文: " + js.slice(2250000 + cIdx - 120, 2250000 + cIdx).replace(/\s+/g, " "));
