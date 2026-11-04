const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
const keys = ["结算", "再来一", "重开", "结束征战", "比赛结果", "胜利", "失败", "模拟中", "倍速", "难度", "战力"];
for (const k of keys) {
  let i = -1, n = 0;
  console.log("\n### " + k + " (" + (j.split(k).length - 1) + ")");
  while ((i = j.indexOf(k, i + 1)) >= 0 && n < 3) {
    console.log(i + ": " + j.slice(Math.max(0, i - 120), i + 160).replace(/\s+/g, " "));
    n++;
  }
}