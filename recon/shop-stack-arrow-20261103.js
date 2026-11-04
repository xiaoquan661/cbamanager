const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* shop-stack-arrow: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{
  top:auto!important;bottom:9px!important;left:11px!important;right:11px!important;
  flex-direction:column!important;align-items:flex-start!important;gap:1px!important;
  white-space:normal!important;overflow:visible!important;
}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-label>b{
  display:block!important;font-size:16px!important;line-height:1.15!important;white-space:nowrap!important;
}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-tag{
  display:block!important;font-size:9px!important;line-height:1.3!important;color:#f8fafc!important;
  white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
  max-width:calc(100% - 20px)!important;flex:none!important;
}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading::after{
  content:"›";position:absolute;right:0;bottom:-1px;font-size:18px;font-weight:400;line-height:1;
  color:#f8fafc;text-shadow:0 1px 3px #000c;pointer-events:none;
}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
