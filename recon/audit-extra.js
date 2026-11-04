const fs = require("fs");
for (const f of ["cba-startup.js", "assets/lamps/cba-lamps-glue.js", "index.html"]) {
  const s = fs.readFileSync(f, "utf8");
  console.log("\n=== " + f);
  for (const k of ["更新公告", "版本更新", "更新内容", "公告", "新手引导", "引导", "签到", "每日签到", "一句话", "简介"]) {
    console.log("  " + k + ": " + (s.split(k).length - 1));
  }
}