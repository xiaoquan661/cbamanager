const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;while((i=s.indexOf("onReview",i))>=0&&n<10){console.log("---",n,JSON.stringify(s.slice(Math.max(0,i-300),i+400)));i+=8;n++;}
