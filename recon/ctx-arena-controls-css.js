const fs=require("fs");const s=fs.readFileSync("cba-startup.css","utf8");let i=0,n=0;
while((i=s.indexOf(".arena-controls",i))>=0&&n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-120),i+300)));i+=10;n++;}
