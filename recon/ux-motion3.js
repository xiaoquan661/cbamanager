// ux-motion3.js — 商店刷新后卡片逐个淡入
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* ux-motion-stagger: 20261030 */";
if (css.indexOf(MARK) >= 0) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
@keyframes cba-card-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
.fantasy-offer-grid .fantasy-flip{animation:cba-card-in .28s ease-out both}
.fantasy-offer-grid .fantasy-flip:nth-child(2){animation-delay:.05s}
.fantasy-offer-grid .fantasy-flip:nth-child(3){animation-delay:.1s}
.fantasy-offer-grid .fantasy-flip:nth-child(4){animation-delay:.15s}
.fantasy-offer-grid .fantasy-flip:nth-child(5){animation-delay:.2s}
@media(prefers-reduced-motion:reduce){.fantasy-offer-grid .fantasy-flip{animation:none!important}}
`;
fs.writeFileSync(cssPath, css, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
// css 版本不变（同一构建版本号），保证缓存刷新
console.log("✓ 商店卡片 stagger 已追加");