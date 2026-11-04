// hupu-usage.js — 查看虎扑功能在 bundle 里的实际用途（决定删除边界）
const fs = require("fs");
const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
function show(mark, before, after, max) {
  let i = raw.indexOf(mark), n = 0;
  console.log("\n======== " + mark + " ========");
  while (i >= 0 && n < max) {
    console.log("--- @" + i + " ---");
    console.log(raw.slice(Math.max(0, i - before), i + after).replace(/\s+/g, " "));
    i = raw.indexOf(mark, i + 1); n++;
  }
}
show("openPostEditor", 300, 200, 2);
show("oss.uploadFile", 250, 150, 2);
show("checkAudit", 200, 150, 4);
show("ColorboxAI.storage", 250, 150, 1);
show("ColorboxAI.auth", 200, 150, 3);
