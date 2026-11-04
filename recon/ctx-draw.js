const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["type:`draw`","type:'draw'","招募新援","招募卡","免费五连","五连招募","drawTickets"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-350),i+450)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
