const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b){const c=s.split(a).length-1;if(c!==1){console.error("MATCH",c,a.slice(0,90));process.exit(1);}s=s.split(a).join(b);}
rep("n.match===26&&((n.finalWins||0)>=2?(n.champions++,o=` 本季总决赛至少两胜，夺得冠军。`):o=` 本季总决赛未达两胜，下季再战。`)",
    "n.match===26&&((n.finalWins||0)>=2?(n.champions++,n.coins+=1e3,n.drawTickets+=2,o=` 本季总决赛至少两胜，夺得冠军。赛季奖励：金币 +1,000、招募卡 ×2。`):(n.coins+=500,n.drawTickets+=1,o=` 本季总决赛未达两胜，下季再战。赛季奖励：金币 +500、招募卡 ×1。`))");
fs.writeFileSync(p,s,"utf8");console.log("reward ok",fs.statSync(p).size);
