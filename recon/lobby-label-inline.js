// lobby-label-inline.js — 大厅标签：标题绿色 + 小标注同行，去掉英文副标与半透明底条
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-label-inline: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

css += "\n" + MARK + `
.fantasy-app .page-home .cover-grid button.cover-tile .cover-label{top:auto!important;bottom:9px!important;left:11px!important;right:auto!important;flex-direction:row!important;align-items:baseline!important;gap:8px!important}
.fantasy-app .page-home .cover-grid button.cover-tile .cover-label>small{display:none!important}
.fantasy-app .page-home .cover-grid button.cover-tile .cover-label>b{color:#a3e635!important;font-size:16px!important;line-height:1.1!important;text-shadow:0 1px 5px #000c!important}
.fantasy-app .page-home .cover-grid button.cover-season .cover-label>b{font-size:18px!important}
.fantasy-app .page-home .cover-grid button.cover-tile .cover-foot{left:auto!important;right:11px!important;bottom:9px!important;top:auto!important;width:auto!important;background:none!important;padding:0!important;color:#f8fafc!important;font-size:10px!important;font-weight:500!important;text-shadow:0 1px 4px #000d!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{top:auto!important;bottom:44px!important;left:11px!important;right:11px!important;flex-direction:row!important;align-items:baseline!important;gap:8px!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-tag{font-size:9px!important;color:#f8fafc!important;text-shadow:0 1px 4px #000d!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-label>b{font-size:16px!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-cta{background:linear-gradient(180deg,#080e1800,#080e18b3)!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 标签同行化已追加，CSS 大小", Buffer.byteLength(css, "utf8"));
