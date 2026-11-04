const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["赛季中途","基础战力","上赛季","胜率","教练"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-200),i+260)));i+=p.length;n++;}
 if(n===0)console.log("(none)");
}
