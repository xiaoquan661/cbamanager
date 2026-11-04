const fs=require("fs");const s=fs.readFileSync("cba-startup.css","utf8");
for(const p of ["team-tabs",".fantasy-tabs"]){let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<10){console.log(JSON.stringify(s.slice(Math.max(0,i-200),i+500)));i+=p.length;n++;}
 if(!n)console.log("(none)");}
