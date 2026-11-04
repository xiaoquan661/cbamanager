const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["球探","scout","招募 1 次","招募教练"]){let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-300),i+350)));i+=p.length;n++;}
 if(!n)console.log("(none)");}
