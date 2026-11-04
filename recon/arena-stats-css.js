// arena-stats-css.js — 球场卡片统计行适配样式
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* arena-stats: 20261030 */";
if (css.indexOf(MARK) >= 0) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.battle-player>span{flex-wrap:wrap;gap:1px 2px;line-height:1.25;padding:2px 3px}
.battle-player>span em{font-size:6.5px;font-variant-numeric:tabular-nums}
`;
fs.writeFileSync(cssPath, css, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=20261030f-arena-stats");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("CSS 已追加，css 版本 → 20261030f-arena-stats");