const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
const oldText="asc ? '↑' : '↓'";
const c=s.split(oldText).length-1;
if(c!==1){console.error("MATCH",c);process.exit(1);}
s=s.split(oldText).join("asc ? '▲' : '▼'");
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
