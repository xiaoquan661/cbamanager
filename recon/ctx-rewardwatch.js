const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let start=s.indexOf("function RewardsPage");let seg=s.slice(start,start+9000);
for(const p of ["async function watch","function watch","claim","completeRewardVideo","random","Math.random"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=seg.indexOf(p,i))>=0&&n<5){console.log(JSON.stringify(seg.slice(Math.max(0,i-400),i+600)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
