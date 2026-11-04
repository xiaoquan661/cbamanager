const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["签约提示","教练签约成功","toast","Toast","showToast"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-400),i+400)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
