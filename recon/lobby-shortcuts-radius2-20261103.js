const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* lobby-shortcuts-radius2: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+"\n.lobby-shortcuts>button.r13-guide-trigger,#r13-guide-button.r13-guide-trigger{border-radius:0!important}\n";fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
