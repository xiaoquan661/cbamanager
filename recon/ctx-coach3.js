const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["CBACoachPowerR28","winRate","baseBonus","coachPower"]){let i=0,n=0;console.log("\n=== "+p+" total?");
 while((i=s.indexOf(p,i))>=0 && n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-260),i+340)));i+=p.length;n++;}
}
