// fix-freeze-ver.js — 升级 glue 版本参数防缓存
const fs = require("fs");
const f = "C:/10.19源码/签下整个CBA/index.html";
let raw = fs.readFileSync(f, "utf8");
const m = raw.match(/cba-lamps-glue.js\?v=[^"']+/);
if (!m) { console.log("锚点未找到"); process.exit(1); }
console.log("当前版本: " + m[0]);
raw = raw.replace(m[0], "cba-lamps-glue.js?v=20261030a-freeze");
fs.writeFileSync(f, raw, "utf8");
console.log("已升级 → cba-lamps-glue.js?v=20261030a-freeze");
