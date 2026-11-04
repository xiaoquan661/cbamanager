const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("className: 'fantasy-sort'");
console.log(JSON.stringify(s.slice(i-200,i+2600)));
