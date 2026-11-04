const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const pats=["休赛期","赛季结束","暂未开放","尚未开放","赛季中","首个赛季","下赛季","明年","开放","主教练"];
for(const p of pats){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<8){console.log(JSON.stringify(s.slice(Math.max(0,i-260),i+300)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
