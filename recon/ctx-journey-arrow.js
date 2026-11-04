const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");let i=s.indexOf("journey-start-arrow");console.log(JSON.stringify(s.slice(i-120,i+260)));
