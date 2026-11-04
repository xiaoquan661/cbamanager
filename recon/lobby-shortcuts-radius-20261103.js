const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* lobby-shortcuts-radius: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+"\n.fantasy-app .lobby-shortcuts>button{border-radius:0!important}\n";fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
