// lb-metrics.js — 排行榜模块内部的 metric/getLeaderboard 结构
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const start = 2284372, end = 2338636;
const seg = js.slice(start, end);
for (const m of ["metric", "gameRankType", "getLeaderboard", "排行榜", "战力", "价值", "排名"]) {
  const hits = [];
  let i = seg.indexOf(m), n = 0;
  while (i >= 0 && n < 4) {
    hits.push("@" + (start + i) + ": " + seg.slice(Math.max(0, i - 100), i + 160).replace(/\s+/g, " ").slice(0, 260));
    i = seg.indexOf(m, i + 1); n++;
  }
  console.log("\n== " + m + " x" + (seg.split(m).length - 1) + " ==\n" + hits.join("\n"));
}