// hupu-ui-entry.js — 定位海报发帖/邀请码的 UI 入口和模块边界
const fs = require("fs");
const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
function ctx(mark, before, after, max) {
  let i = raw.indexOf(mark), n = 0;
  console.log("\n======== " + mark + " ========");
  while (i >= 0 && n < max) {
    console.log("--- @" + i + " ---");
    console.log(raw.slice(Math.max(0, i - before), i + after).replace(/\s+/g, " ").slice(0, 500));
    i = raw.indexOf(mark, i + 1); n++;
  }
}
// 分享 UI 按钮文案
ctx("分享战报", 250, 250, 3);
ctx("生成海报", 250, 250, 3);
ctx("海报分享", 250, 250, 3);
// 邀请码 UI
ctx("邀请码", 200, 300, 6);
