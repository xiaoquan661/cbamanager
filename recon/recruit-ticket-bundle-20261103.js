const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b,expect=1){const c=s.split(a).length-1;if(c!==expect){console.error("MATCH",c,a.slice(0,100));process.exit(1);}s=s.split(a).join(b);}
rep("function dv(e,t){if(t.type===`completeMatch`&&e.lastSettledMatchId===t.matchId)return structuredClone(e);if(t.type===`dailyLogin`)",
    "function dv(e,t){if(t.type===`completeMatch`&&e.lastSettledMatchId===t.matchId)return structuredClone(e);if(t.type===`adTicketReward`){let n=structuredClone(e);n.drawTickets=(Number(n.drawTickets)||0)+1;Q_(n,'看广告补给 · 招募卡 +1');return n}if(t.type===`dailyLogin`)");
rep("const total = ITEMS.reduce((n, value) => n + count(state?.fantasyItems?.[value.code]), 0)",
    "const total = ITEMS.reduce((n, value) => n + count(state?.fantasyItems?.[value.code]), 0) + count(state?.drawTickets)");
rep("h('p', null, '未完整观看不发奖。奖励确认前请勿重复操作，实际道具数量以云端结果为准。')",
    "h('p', null, '招募卡：可在本页看广告补给，每次 +1 张；使用后随机招募 1 名球员，消耗 1 张。'), h('p', null, '未完整观看不发奖。奖励确认前请勿重复操作，实际道具数量以云端结果为准。')");
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
