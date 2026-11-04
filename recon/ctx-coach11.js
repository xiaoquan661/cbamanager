const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const pats=["不能","不可","无法","暂不","请先"];
for(const p of pats){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<60){const seg=s.slice(Math.max(0,i-60),i+80);if(seg.includes("教练")||seg.includes("主教练"))console.log(JSON.stringify(seg));i+=p.length;n++;}
}
