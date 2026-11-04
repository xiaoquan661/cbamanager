const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const p="请先完成当前比赛";let i=0,n=0;while((i=s.indexOf(p,i))>=0){console.log(n++,JSON.stringify(s.slice(i-120,i+80)));i+=p.length;}
