const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;while((i=s.indexOf("directAssets",i))>=0&&n<10){console.log("---",n,JSON.stringify(s.slice(Math.max(0,i-200),i+300)));i+=12;n++;}
