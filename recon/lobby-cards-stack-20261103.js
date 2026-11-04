const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* lobby-cards-stack: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-app .page-home .cover-grid button.cover-market .cover-label,
.fantasy-app .page-home .cover-grid button.cover-fusion .cover-label,
.fantasy-app .page-home .cover-grid button.cover-ranking .cover-label,
.fantasy-app .page-home .cover-grid button.cover-season .cover-label{
  top:auto!important;bottom:27px!important;left:11px!important;right:auto!important;
}
.fantasy-app .page-home .cover-grid button.cover-market .cover-foot,
.fantasy-app .page-home .cover-grid button.cover-fusion .cover-foot,
.fantasy-app .page-home .cover-grid button.cover-ranking .cover-foot,
.fantasy-app .page-home .cover-grid button.cover-season .cover-foot{
  top:auto!important;bottom:8px!important;left:11px!important;right:11px!important;
  width:auto!important;justify-content:space-between!important;
  background:transparent!important;padding:0!important;font-size:10px!important;
  color:#f8fafc!important;text-shadow:0 1px 4px #000d!important;
}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
