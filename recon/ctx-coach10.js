const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("className:`coach-center`");
console.log("idx",i);
console.log(JSON.stringify(s.slice(i-6000,i+300)));
