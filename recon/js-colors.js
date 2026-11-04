// js-colors.js — 统计 JS 文件里的颜色字面量（判断是否需随 CSS 一并转换）
const fs = require("fs");
const files = [
  "C:/10.19源码/签下整个CBA/cba-startup.js",
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js",
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-daily-tasks.js",
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-rank-sync.js",
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-squad-share-r29.js",
  "C:/10.19源码/签下整个CBA/cba-launch.js",
];
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const hexes = raw.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const uniq = [...new Set(hexes.map(h => h.toLowerCase()))];
  console.log(f.split("/").pop() + ": hex " + hexes.length + " 处 / " + uniq.length + " 种");
  if (uniq.length <= 40) console.log("  " + uniq.join(", "));
}
