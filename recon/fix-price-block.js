const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* price-block: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-player-screen .pd-trade-actions .fantasy-confirm-price{background:transparent!important;border:0!important;border-top:1px solid #263244!important;border-radius:0!important;padding:10px 0!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 价格块灰底已移除");
