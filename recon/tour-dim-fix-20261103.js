const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* tour-dim-fix: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.cba-home-tour-shade{background:rgba(3,15,21,.72)!important}
.cba-home-tour-ring{box-shadow:0 0 0 3px rgba(166,226,54,.14),0 0 22px rgba(166,226,54,.3)!important}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
