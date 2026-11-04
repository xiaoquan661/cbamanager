const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("调整首发阵容");
console.log(JSON.stringify(s.slice(i-2500,i+2500)));
