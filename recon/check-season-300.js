const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["赛季奖励：金币 +300","coins:(n.finalWins||0)>=2?1e3:300","`1,000`:`300`","赛季奖励：金币 +500"]){console.log(p,(s.split(p).length-1));}
