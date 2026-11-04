const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("arena-result-content");console.log(JSON.stringify(s.slice(i-2200,i+2200)));
