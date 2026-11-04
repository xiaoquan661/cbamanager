const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* rewards-bg: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-app .cba-rewards-page{background:transparent!important;padding:8px 0 24px!important;margin:0!important;border:0!important;box-shadow:none!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 金币页背景已透明并对齐父级");
