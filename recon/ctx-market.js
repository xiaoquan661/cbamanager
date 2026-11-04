const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("function Market(");
console.log("idx",i);
console.log(JSON.stringify(s.slice(i,i+9000)));
