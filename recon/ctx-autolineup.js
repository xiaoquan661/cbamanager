const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["一键布阵","smartLineup","autoLineup","recommendLineup"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-500),i+700)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
