const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("sprite-runtime.js");console.log(JSON.stringify(s.slice(i,i+4000)));
