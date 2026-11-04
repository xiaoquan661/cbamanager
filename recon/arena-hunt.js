// arena-hunt.js — 找比赛进行中的球场阵容组件
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const m of ["arena-court", "arena-player", "match-court", "vs-court", "live-court", "court-spot", "on-court", "arena-lineup", "battle-", "arena-"]) {
  const c = js.split(m).length - 1;
  if (c) console.log(m + " x" + c);
}
// points 与 分 组合
let s = 0, i, n = 0;
while ((i = js.indexOf(".points", s)) >= 0 && n < 20) {
  s = i + 1;
  if (i > 140000 && i < 400000) continue;
  const ctx = js.slice(Math.max(0, i - 100), i + 100).replace(/\s+/g, " ");
  if (/分|position/.test(ctx)) {
    console.log("\n--- points @" + i + " ---");
    console.log(ctx.slice(0, 190));
    if (++n > 8) break;
  }
}
