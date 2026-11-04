const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["更换主教练：","点击更换","教练签约","coach-power-summary","coach-top-market"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<5){console.log(JSON.stringify(s.slice(i-500,i+700)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
