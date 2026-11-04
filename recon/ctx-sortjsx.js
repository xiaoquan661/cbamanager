const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("const active = tab !== 'coaches'");
console.log(JSON.stringify(s.slice(i-120,i+700)));
