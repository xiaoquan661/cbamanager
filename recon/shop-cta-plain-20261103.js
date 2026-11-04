const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* shop-cta-plain: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-app .page-home .cover-grid button.cover-recruit .cover-recruit-cta{
  left:auto!important;right:11px!important;bottom:9px!important;top:auto!important;
  width:auto!important;padding:0!important;justify-content:flex-end!important;
  background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;
  color:#f8fafc!important;font-size:10px!important;font-weight:600!important;
  text-shadow:0 1px 4px #000d!important;
}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
