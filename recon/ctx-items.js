const fs=require("fs");
for(const f of ["cba-startup.js","assets/lamps/cba-lamps-glue.js","assets/lamps/cba-daily-tasks.js"]){
 const s=fs.readFileSync(f,"utf8");console.log("###",f);
 for(const p of ["道具说明","招募卡","drawTickets","看广告"]){
  let i=0,n=0;console.log("=== "+p);
  while((i=s.indexOf(p,i))>=0&&n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-220),i+300)));i+=p.length;n++;}
  if(!n)console.log("(none)");
 }
}
