const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=0,n=0;
while((i=s.indexOf("pendingMatch",i))>=0 && n<40){console.log(JSON.stringify(s.slice(Math.max(0,i-180),i+220)));i+=12;n++;}
