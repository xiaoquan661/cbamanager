// position-render.js — 找 position 字段的显示点（JSX/children）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const pats = [/children:.{0,30}position/g, /\.position\b.{0,40}(children|jsx)/g, /\(p\.position\)/g, /\(e\.position\)/g, /\(t\.position\)/g, /position\)/g];
const seen = new Set();
for (const p of pats) {
  for (const m of js.matchAll(p)) {
    const i = m.index;
    if (seen.has(i)) continue;
    seen.add(i);
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - 180), i + 160).replace(/\s+/g, " ").slice(0, 330) + "\n");
  }
}
