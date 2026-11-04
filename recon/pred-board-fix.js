// pred-board-fix.js — 清理多余赋值 + rank-sync 版本参数升级
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
const JUNK = "        global.CBARIkiBoardFetch = null;\n";
if (glue.indexOf(JUNK) >= 0) { glue = glue.replace(JUNK, ""); console.log("✓ 清理多余赋值"); }
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ " + e.message); process.exit(1); }

let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-rank-sync\.js\?v=\d+/, "cba-rank-sync.js?v=3");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("✓ rank-sync 版本 → v=3");