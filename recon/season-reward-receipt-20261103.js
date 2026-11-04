const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b){const c=s.split(a).length-1;if(c!==1){console.error("MATCH",c,a.slice(0,100));process.exit(1);}s=s.split(a).join(b);}
rep("n.match===26&&((n.finalWins||0)>=2?(n.champions++,n.coins+=1e3,n.drawTickets+=2,o=` 本季总决赛至少两胜，夺得冠军。赛季奖励：金币 +1,000、招募卡 ×2。`):(n.coins+=500,n.drawTickets+=1,o=` 本季总决赛未达两胜，下季再战。赛季奖励：金币 +500、招募卡 ×1。`))",
    "n.match===26&&(r.seasonBonus={coins:(n.finalWins||0)>=2?1e3:500,tickets:(n.finalWins||0)>=2?2:1},(n.finalWins||0)>=2?(n.champions++,n.coins+=1e3,n.drawTickets+=2,o=` 本季总决赛至少两胜，夺得冠军。赛季奖励：金币 +1,000、招募卡 ×2。`):(n.coins+=500,n.drawTickets+=1,o=` 本季总决赛未达两胜，下季再战。赛季奖励：金币 +500、招募卡 ×1。`))");
rep("if(!Number.isSafeInteger(reward?.coins)||reward.coins<0||next.coins-state.coins!==reward.coins)throw new Error('比赛奖励回执与到账金额不一致');",
    "if(!Number.isSafeInteger(reward?.coins)||reward.coins<0||next.coins-state.coins!==reward.coins+Number(next.lastMatch?.seasonBonus?.coins||0))throw new Error('比赛奖励回执与到账金额不一致');");
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
