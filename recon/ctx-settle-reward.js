const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("n.lastMatch=r,n.lastSettledMatchId");console.log(JSON.stringify(s.slice(i-1800,i+300)));
