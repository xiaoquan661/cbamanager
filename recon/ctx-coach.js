const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const pats=["coach","Coach","\\u6559\\u7ec3","\\u57fa\\u7840\\u6218\\u529b","\\u80dc\\u7387","\\u4e0a\\u8d5b\\u5b63","\\u5b63\\u4e2d"];
for(const p of pats){let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0 && n<12){console.log(JSON.stringify(s.slice(Math.max(0,i-160),i+220)));i+=p.length;n++;}}
