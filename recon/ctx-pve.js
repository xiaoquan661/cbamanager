const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("pve:");console.log(JSON.stringify(s.slice(i-300,i+900)));
