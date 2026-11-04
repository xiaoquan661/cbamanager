const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lineup-avatar-fit: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-app .journey-lineup img{object-fit:cover!important;object-position:50% 14%!important;width:100%!important;height:100%!important}
.fantasy-app .journey-lineup>div{overflow:hidden!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 首发头像裁切已统一");
