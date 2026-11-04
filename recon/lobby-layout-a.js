// lobby-layout-a.js — 大厅「主视觉 + 四宫格」排版
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-layout-a: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

css += "\n" + MARK + `
.fantasy-app .page-home .cover-grid{grid-template-rows:minmax(132px,1.18fr) minmax(104px,1fr) minmax(104px,1fr)!important;min-height:370px!important}
.fantasy-app .page-home .cover-grid button.cover-season{grid-area:1/1/auto/11!important}
.fantasy-app .page-home .cover-grid button.cover-market{grid-area:2/1/auto/6!important}
.fantasy-app .page-home .cover-grid button.cover-fusion{grid-area:2/6/auto/11!important}
.fantasy-app .page-home .cover-grid button.cover-recruit{grid-area:3/1/auto/6!important}
.fantasy-app .page-home .cover-grid button.cover-ranking{grid-area:3/6/auto/11!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 方案 A 布局已追加，CSS 大小", Buffer.byteLength(css, "utf8"));
