const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const pats=["coach-market","coachMarket","教练市场","教练签约市场","赛季","教练"];
for(const p of pats){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<10){console.log(JSON.stringify(s.slice(Math.max(0,i-220),i+260)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
