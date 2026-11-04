const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b,expect=1){const c=s.split(a).length-1;if(c!==expect){console.error("MATCH",c,a.slice(0,90));process.exit(1);}s=s.split(a).join(b);}
rep("coins:(n.finalWins||0)>=2?1e3:500","coins:(n.finalWins||0)>=2?1e3:300");
rep("n.coins+=500,n.drawTickets+=1,o=` 本季总决赛未达两胜，下季再战。赛季奖励：金币 +500、招募卡 ×1。`","n.coins+=300,n.drawTickets+=1,o=` 本季总决赛未达两胜，下季再战。赛季奖励：金币 +300、招募卡 ×1。`");
rep("`1,000`:`500`","`1,000`:`300`",2);
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
