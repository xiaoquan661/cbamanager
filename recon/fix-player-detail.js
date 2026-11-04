// fix-player-detail.js — 球员详情：头部/底栏配色，消除内容与底栏之间的大空白
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* player-detail-fix: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

css += "\n" + MARK + `
.fantasy-player-screen,.fantasy-player-screen .pd-detail{background:#090d16!important}
.fantasy-player-screen .pd-header{background:linear-gradient(135deg,#111827 0%,#1b2535 100%)!important;border-bottom:1px solid #263244!important}
.fantasy-player-screen .pd-header,.fantasy-player-screen .pd-header *{color:#f8fafc!important}
.fantasy-player-screen .pd-header .pd-follow{color:#a3e635!important}
.fantasy-player-screen .pd-body{flex:0 0 auto!important;padding-bottom:24px!important}
.fantasy-player-screen .pd-trade-actions{position:sticky!important;bottom:0!important;z-index:6!important;background:#111827!important;border-top:1px solid #263244!important;box-shadow:0 -8px 24px #0007!important}
.fantasy-player-screen .pd-trade-actions *{color:#f8fafc}
.fantasy-player-screen .pd-trade-actions .fantasy-button,.fantasy-player-screen .pd-trade-actions button{color:#111827}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 球员详情样式已修复，CSS 大小", Buffer.byteLength(css, "utf8"));
