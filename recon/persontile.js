// persontile.js — 找 PersonTile 的位置渲染
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("PersonTile");
let found = [];
let s = 0;
while ((i = js.indexOf("PersonTile", s)) >= 0) { found.push(i); s = i + 1; }
console.log("PersonTile 出现 " + found.length + " 处");
// 定义处（FantasyViews 对象里）
for (const idx of found) {
  const seg = js.slice(Math.max(0, idx - 60), idx + 60).replace(/\s+/g, " ");
  if (/PersonTile\s*[:=]/.test(seg)) {
    console.log("\n定义候选 @" + idx + ":\n" + js.slice(Math.max(0, idx - 100), idx + 2600).replace(/\s+/g, " ").slice(0, 2600));
  }
}
