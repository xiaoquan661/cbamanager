const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["中途","不能签约","无法签约","教练","签约教练","更换教练","coachPowerPolicy"]){let i=0,n=0;console.log("\n=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-240),i+300)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
