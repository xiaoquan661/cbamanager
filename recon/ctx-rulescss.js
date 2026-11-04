const fs=require("fs");const s=fs.readFileSync("cba-startup.css","utf8");
let i=0,n=0;while((i=s.indexOf("cba-reward-rules",i))>=0&&n<10){console.log(JSON.stringify(s.slice(Math.max(0,i-200),i+500)));i+=10;n++;}
