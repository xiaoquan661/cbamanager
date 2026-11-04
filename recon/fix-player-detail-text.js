const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* player-detail-text: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-player-screen .pd-header .pd-name h2,
.fantasy-player-screen .pd-header .pd-name small,
.fantasy-player-screen .pd-header .pd-name p{color:#f8fafc!important}
.fantasy-player-screen .pd-header .pd-name small{opacity:.75!important}
.fantasy-player-screen .pd-header .pd-selected,
.fantasy-player-screen .pd-header .pd-selected *{color:#f8fafc!important}
.fantasy-player-screen .pd-trade-actions .fantasy-confirm-price strong{color:#a3e635!important}
.fantasy-player-screen .pd-trade-actions .fantasy-confirm-price span{color:#94a3b8!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 球员页文字颜色已修正");
