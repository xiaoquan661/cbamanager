const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["招募 1 次","招募 5 次","单抽","五连","scout-red","drawCoach","draw`})","count:1"]){let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-400),i+500)));i+=p.length;n++;}
 if(!n)console.log("(none)");}
