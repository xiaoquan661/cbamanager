const fs=require("fs");const s=fs.readFileSync("assets/sprites/sprite-home.js","utf8");let i=s.indexOf("i0105");console.log(JSON.stringify(s.slice(i-200,i+300)));
