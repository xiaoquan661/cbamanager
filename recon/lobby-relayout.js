// lobby-relayout.js — 大厅磁贴重排：填补第2行空洞
// season: 3行 → 2行；team: 4行通栏 → 3-4行左侧（高卡）
// 追加到 cba-startup.css 末尾（后置 + !important 覆盖此前的响应式规则）
const fs = require("fs");
const cssPath = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* lobby-relayout: 20261030 */";
if (css.indexOf(MARK) >= 0) { console.log("已存在，跳过"); process.exit(0); }
css += "\n" + MARK + `
.page-home .cover-grid button.cover-season{grid-area:2/1/auto/7!important}
.page-home .cover-grid button.cover-team{grid-area:3/1/span 2/7!important}
.page-home .cover-grid button.cover-team .cover-team-crest{top:16px;left:14px;width:60px;height:70px}
.page-home .cover-grid button.cover-team .cover-label{top:18px;left:88px}
.page-home .cover-grid button.cover-team .cover-team-stats{bottom:14px;left:88px}
`;
fs.writeFileSync(cssPath, css, "utf8");
// 版本升级（css 在 html 引用处）
const htmlPath = "C:/10.19源码/签下整个CBA/index.html";
let html = fs.readFileSync(htmlPath, "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=20261030c-layout");
fs.writeFileSync(htmlPath, html, "utf8");
console.log("布局重排已追加，css 版本 → 20261030c-layout");
