const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* reward-rules-visible: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+`
.fantasy-app .cba-reward-rules p{color:#cbd5e1!important;font-size:11px!important;line-height:1.7!important;margin:6px 0!important}
`;
fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
