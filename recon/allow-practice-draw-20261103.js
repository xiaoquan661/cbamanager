const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
const oldText="const allowed=new Set(['lineup','equipCoach','setPlans','setPlan','setTactics','setTeamLogo','recordMatchProgress','beginMatch','completeMatch','nextSeason','close','reorderCards','lock','adjustMatchTactics','taskClaim','dailyCheckin','adCoinReward']);";
const newText="const allowed=new Set(['lineup','equipCoach','setPlans','setPlan','setTactics','setTeamLogo','recordMatchProgress','beginMatch','completeMatch','nextSeason','close','reorderCards','lock','adjustMatchTactics','taskClaim','dailyCheckin','adCoinReward','draw','drawCoach','adTicketReward']);";
const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c);process.exit(1);}s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
