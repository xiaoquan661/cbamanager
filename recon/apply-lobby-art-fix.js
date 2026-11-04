// apply-lobby-art-fix.js — 用同优先级选择器覆盖大厅旧背景
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-art-fix: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

const art = `
.fantasy-app .page-home .cover-grid button.cover-tile>.module-art{display:none!important}
.fantasy-app .page-home .cover-grid button.cover-recruit>img{display:none!important}
.fantasy-app .page-home .cover-grid button.cover-market{background-image:linear-gradient(180deg,#080e1800 38%,#080e18d9 100%),url("assets/lobby/lobby-signing.jpg")!important;background-size:cover!important;background-position:50% 38%!important;background-repeat:no-repeat!important}
.fantasy-app .page-home .cover-grid button.cover-fusion{background-image:linear-gradient(180deg,#080e1800 38%,#080e18d9 100%),url("assets/lobby/lobby-duel.jpg")!important;background-size:cover!important;background-position:50% 42%!important;background-repeat:no-repeat!important}
.fantasy-app .page-home .cover-grid button.cover-recruit{background-image:linear-gradient(180deg,#080e18cc 0%,#080e1800 22%,#080e1800 52%,#080e18e6 100%),url("assets/lobby/lobby-star.jpg")!important;background-size:cover!important;background-position:50% 34%!important;background-repeat:no-repeat!important}
.fantasy-app .page-home .cover-grid button.cover-season{background-image:linear-gradient(180deg,#080e1800 42%,#080e18e0 100%),url("assets/lobby/lobby-arena.jpg")!important;background-size:cover!important;background-position:50% 50%!important;background-repeat:no-repeat!important}
.fantasy-app .page-home .cover-grid button.cover-ranking{background-image:linear-gradient(90deg,#080e18e6 0%,#080e1866 55%,#080e18b3 100%),url("assets/lobby/lobby-trophy.jpg")!important;background-size:cover!important;background-position:50% 46%!important;background-repeat:no-repeat!important}
`;
css += "\n" + MARK + art;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 大厅插图覆盖已追加，CSS 大小", Buffer.byteLength(css, "utf8"));
