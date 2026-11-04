// 弹窗主按钮的渐变末端是 #64748b，深色文字在右半段几乎不可见
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* modal-action-contrast: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-modal .fantasy-button:not(.subtle){
  background:linear-gradient(110deg,#a3e635,#83bb1b)!important;
  color:#090d16!important;
  border-color:#a3e635!important;
}
.fantasy-modal .fantasy-button.subtle{
  background:#111827!important;
  color:#f8fafc!important;
  border-color:#64748b!important;
}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);
