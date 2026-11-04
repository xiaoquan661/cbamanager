const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let idx=[];let i=0;while((i=s.indexOf("function watch",i))>=0){idx.push(i);i+=10;}
console.log(idx);
let rp=s.indexOf("function RewardsPage");console.log("rp",rp);
for(const p of idx.filter(x=>x<rp).slice(-3)){console.log("---",p);console.log(JSON.stringify(s.slice(p-1500,p+2500)));}
