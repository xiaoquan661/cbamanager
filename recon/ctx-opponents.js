const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("对手首发");console.log("idx",i);console.log(JSON.stringify(s.slice(i-1200,i+1400)));
