// leaderboard-probe.js — createCBALeaderboard 结构与榜单切换
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("createCBALeaderboard");
// 定义处（后面紧跟 = 或 function）
let s = 0, n = 0;
while ((i = js.indexOf("createCBALeaderboard", s)) >= 0 && n < 6) {
  console.log("--- @" + i + " ---");
  console.log(js.slice(Math.max(0, i - 120), i + 260).replace(/\s+/g, " ").slice(0, 360) + "\n");
  s = i + 1; n++;
}