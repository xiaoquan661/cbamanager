// xe-def2.js — 找 xe 定义（带 dismissedArena 上下文）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let s = 0, i, n = 0;
while ((i = js.indexOf("xe=", s)) >= 0 && n < 10) {
  s = i + 1;
  const ctx = js.slice(Math.max(0, i - 260), i + 260).replace(/\s+/g, " ");
  if (/dismissedArena|pendingMatch|pe\(/.test(ctx)) {
    console.log("--- @" + i + " ---");
    console.log(ctx + "\n");
    n++;
  }
}