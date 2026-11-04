const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* lobby-shortcuts-unify: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+`
.fantasy-app .lobby-shortcuts>button.r13-guide-trigger{border-radius:0!important}
.fantasy-app .lobby-shortcuts>button.r13-guide-trigger .r26-guide-trigger-title{color:#f8fafc!important}
.fantasy-app .lobby-shortcuts>button.r13-guide-trigger .guide-medal{color:#f8fafc!important;border-color:#f8fafc!important}
.fantasy-app .lobby-shortcuts>button.r13-guide-trigger .guide-medal svg{stroke:#f8fafc!important;color:#f8fafc!important}
`;
fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
