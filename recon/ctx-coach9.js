const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const idx=s.indexOf("coach-center");
console.log(JSON.stringify(s.slice(idx-3000,idx+1200)));
