const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("className:`arena-controls`");
console.log(JSON.stringify(s.slice(i-60,i+700)));
