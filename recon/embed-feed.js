// embed-feed.js — 用合并后的 player-feed.json 替换 bundle 内嵌的 window.CBA_PLAYER_FEED
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const feed = JSON.parse(fs.readFileSync(root + "player-feed.json", "utf8"));
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

const mark = "window.CBA_PLAYER_FEED=";
const at = js.indexOf(mark);
if (at < 0) { console.log("未找到内嵌 feed"); process.exit(1); }
const start = js.indexOf("{", at);
let i = start, depth = 0, inStr = false, quote = "", esc = false;
for (; i < js.length; i++) {
  const c = js[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === quote) inStr = false;
    continue;
  }
  if (c === '"' || c === "'") { inStr = true; quote = c; continue; }
  if (c === "{") depth++;
  else if (c === "}") { depth--; if (depth === 0) break; }
}
if (depth !== 0) { console.log("feed 边界解析失败"); process.exit(1); }

const before = js.slice(0, start);
const after = js.slice(i + 1);
const next = before + JSON.stringify(feed) + after;
fs.writeFileSync(root + "cba-startup.js", next, "utf8");
try { new Function(next); console.log("✓ 内嵌 feed 已替换，语法 OK"); }
catch (e) { console.log("✗ 语法失败:", e.message); process.exit(1); }
console.log("feed updatedAt:", feed.updatedAt, "completeThrough:", feed.coverage.completeThrough, "rows:", feed.coverage.playerGameRows);
console.log("bundle 大小:", Buffer.byteLength(next, "utf8"));
