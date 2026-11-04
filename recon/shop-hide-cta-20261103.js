const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* shop-hide-cta: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-cta{display:none!important}
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-shop-heading{bottom:11px!important}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
