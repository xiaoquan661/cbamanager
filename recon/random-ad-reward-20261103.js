const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b,expect=1){const c=s.split(a).length-1;if(c!==expect){console.error("MATCH",c,a.slice(0,100));process.exit(1);}s=s.split(a).join(b);}
rep("if(t.type===`adTicketReward`){let n=structuredClone(e);n.drawTickets=(Number(n.drawTickets)||0)+1;Q_(n,'看广告补给 · 招募卡 +1');return n}",
    "if(t.type===`adTicketReward`){let n=structuredClone(e);n.drawTickets=(Number(n.drawTickets)||0)+1;Q_(n,'看广告补给 · 招募卡 +1');return n}if(t.type===`randomAdReward`){let n=structuredClone(e);if(J_(n)<.5){n.drawTickets=(Number(n.drawTickets)||0)+1;Q_(n,'看广告随机补给 · 招募卡 +1')}else{n.fantasyItems=n.fantasyItems||{};n.fantasyItems.prediction_x5=(Number(n.fantasyItems.prediction_x5)||0)+1;Q_(n,'看广告随机补给 · 5倍金币卡 +1')}return n}");
rep("'draw','drawCoach','adTicketReward']);","'draw','drawCoach','adTicketReward','randomAdReward']);");
rep("...[2, 5].map(multiplier","...[5].map(multiplier");
rep("看广告，随机领卡（不限次数）","看广告，随机领卡");
rep("每天不限次数 · 每次完整观看随机得 1 张道具卡","每次完整观看随机得 1 张道具卡");
rep("每天不限观看次数，每次完整观看随机获得 1 张。","每次完整观看随机获得 1 张。");
rep("招募卡：可在本页看广告补给，每次 +1 张；使用后随机招募 1 名球员，消耗 1 张。","招募卡：通过「看广告，随机领卡」随机获得；使用后随机招募 1 名球员，消耗 1 张。");
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
