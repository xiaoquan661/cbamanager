const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");let i=s.indexOf("比赛奖励回执与到账金额不一致");console.log(JSON.stringify(s.slice(i-1200,i+800)));
