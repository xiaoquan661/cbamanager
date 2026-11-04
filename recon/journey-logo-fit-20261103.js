// 旧规则 .journey-lineup img 把队徽也套上了 100% 宽高 + cover，导致队徽被裁切溢出
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* journey-logo-fit: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .journey-lineup .fantasy-avatar img{
  object-fit:cover!important;
  object-position:50% 14%!important;
  width:100%!important;
  height:100%!important;
}
.fantasy-app .journey-lineup .fantasy-team-logo{
  position:static!important;
  inset:auto!important;
  width:18px!important;
  height:18px!important;
  margin-left:5px!important;
  align-self:center!important;
  justify-self:start!important;
  object-fit:contain!important;
  filter:none!important;
}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);
