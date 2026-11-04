const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const oldText=".fantasy-market .cba-sort-arrow{font-size:11px;line-height:1;font-weight:700;color:inherit;opacity:.95}";
const newText=".fantasy-market .cba-sort-arrow{font-size:9px;line-height:1;font-weight:700;color:inherit;opacity:.95;transform:translateY(-.5px)}";
const c=css.split(oldText).length-1;
if(c!==1){console.error("CSS MATCH",c);process.exit(1);}
css=css.split(oldText).join(newText);
fs.writeFileSync(p,css,"utf8");
console.log("css bytes",fs.statSync(p).size);
