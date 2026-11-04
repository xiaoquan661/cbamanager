const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* shop-heading-oneline: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{
  flex-wrap:nowrap!important;white-space:nowrap!important;gap:8px!important;overflow:visible!important;
}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-label,
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-label>b{
  white-space:nowrap!important;flex:none!important;
}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-tag{
  white-space:nowrap!important;flex:0 1 auto!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
@media(max-width:380px){
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{gap:5px!important}
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-label>b{font-size:14px!important}
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-tag{font-size:8px!important}
}
@media(max-width:340px){
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{gap:4px!important}
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-label>b{font-size:13px!important}
  .fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-tag{font-size:7.5px!important}
}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
