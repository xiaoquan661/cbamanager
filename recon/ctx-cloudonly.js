const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");let i=s.indexOf("该功能需要正式云端账户");console.log(JSON.stringify(s.slice(i-800,i+500)));
