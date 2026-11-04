const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* daily-order: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .page-home .lobby-shortcuts [data-cba-task-entry="1"]{order:1!important}
.fantasy-app .page-home .lobby-shortcuts>button[aria-label="每日签到"]{order:2!important}
.fantasy-app .page-home .lobby-shortcuts #r13-guide-button{order:3!important}
.fantasy-app .page-home .lobby-shortcuts>button[aria-label="范特西表现榜"]{order:4!important}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);