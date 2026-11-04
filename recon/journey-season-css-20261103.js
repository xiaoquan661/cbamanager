const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* journey-season-summary: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+"\n.journey-season-summary{margin:10px 0 0}\n";fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
