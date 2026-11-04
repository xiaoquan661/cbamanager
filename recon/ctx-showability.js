const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;while((i=s.indexOf("showAbility",i))>=0&&n<20){console.log(n++,JSON.stringify(s.slice(Math.max(0,i-160),i+120)));i+=12;}
