const fs = require("fs");
const files = ["C:/10.19源码/签下整个CBA/cba-startup.css", "C:/10.19源码/签下整个CBA/cba-startup.js", "C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", "C:/10.19源码/签下整个CBA/index.html"];
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  const map = {};
  for (const m of t.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) {
    const v = "#" + m[1].toLowerCase();
    map[v] = (map[v] || 0) + 1;
  }
  const top = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 60);
  console.log("\n=== " + f.split("/").pop() + " 共 " + Object.keys(map).length + " 色 ===");
  console.log(top.map(([k, v]) => k + ":" + v).join("  "));
}
