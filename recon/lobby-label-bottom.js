// lobby-label-bottom.js — 大厅模块标题移到底部渐变区，避免遮挡主图
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-label-bottom: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

css += "\n" + MARK + `
.fantasy-app .page-home .cover-grid button.cover-market .cover-label,
.fantasy-app .page-home .cover-grid button.cover-fusion .cover-label,
.fantasy-app .page-home .cover-grid button.cover-season .cover-label,
.fantasy-app .page-home .cover-grid button.cover-ranking .cover-label{top:auto!important;bottom:28px!important;left:11px!important;right:11px!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{top:auto!important;bottom:40px!important;left:11px!important;right:11px!important}
.fantasy-app .page-home .cover-grid button.cover-label>b,
.fantasy-app .page-home .cover-grid button.cover-tile .cover-label>b{font-size:16px!important;line-height:1.15!important}
.fantasy-app .page-home .cover-grid button.cover-season .cover-label>b{font-size:18px!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 标题已改为底部定位，CSS 大小", Buffer.byteLength(css, "utf8"));
