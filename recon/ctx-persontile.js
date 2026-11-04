const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;while((i=s.indexOf("PersonTile",i))>=0&&n<8){console.log("---",n);console.log(JSON.stringify(s.slice(Math.max(0,i-500),i+900)));i+=10;n++;}
