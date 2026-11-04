const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-label-order: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-label{order:-1!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 商店标题顺序已修正");
