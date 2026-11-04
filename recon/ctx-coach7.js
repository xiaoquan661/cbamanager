const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["比赛进行中不能更换主教练","比赛进行中不能升级主教练","该教练不在本赛季签约名单"]){
 let i=s.indexOf(p);console.log("=== "+p);
 if(i<0){console.log("none");continue;}
 console.log(JSON.stringify(s.slice(i-900,i+500)));
}
