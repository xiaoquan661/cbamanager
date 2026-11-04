const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;while((i=s.indexOf("__CBA_ASSET__",i))>=0&&n<8){console.log("---",n,JSON.stringify(s.slice(Math.max(0,i-300),i+500)));i+=15;n++;}
