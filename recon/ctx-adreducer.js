const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["claimAdReward","beginAdReward","adReward.pending","lastAdReceipt","itemCode"]){let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<10){console.log(JSON.stringify(s.slice(Math.max(0,i-500),i+700)));i+=p.length;n++;}
 if(!n)console.log("(none)");}
