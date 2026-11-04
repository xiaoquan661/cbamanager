// 弹窗正文被旧浅色主题规则设成 #111827，在深色弹窗上不可见
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* modal-text-fix: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-modal{color:#f8fafc!important}
.fantasy-modal p,
.fantasy-modal .fantasy-note,
.fantasy-modal .fantasy-copy,
.fantasy-modal .fantasy-modal-text,
.fantasy-modal>p{color:#f8fafc!important}
.fantasy-modal small{color:#94a3b8!important}
.fantasy-modal strong{color:#a3e635!important}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);