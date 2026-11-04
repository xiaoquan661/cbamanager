const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
for (const k of ["本周活跃度", "每项 20 金币", "领取今日奖励", "attendance-month", "daily-hub"]) {
  let i = j.indexOf(k);
  console.log("\n### " + k + " @" + i);
  if (i >= 0) console.log(j.slice(Math.max(0, i - 1500), i + 1500).replace(/\s+/g, " "));
}