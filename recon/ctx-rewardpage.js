const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("看广告，随机领卡");console.log("idx",i);console.log(JSON.stringify(s.slice(i-5000,i+3000)));
