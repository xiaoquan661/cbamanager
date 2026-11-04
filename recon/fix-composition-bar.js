const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* composition-bar: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.fantasy-player-screen .pd-composition-grid{background:#0f1622!important;border:1px solid #263244!important;border-radius:10px!important;padding:4px!important;gap:4px!important}
.fantasy-player-screen .pd-composition-grid>div{background:#1b2535!important;border:1px solid #263244!important;border-radius:7px!important}
.fantasy-player-screen .pd-composition-grid strong{color:#f8fafc!important}
.fantasy-player-screen .pd-composition-grid span{color:#94a3b8!important}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 当前组成容器已改深色");
