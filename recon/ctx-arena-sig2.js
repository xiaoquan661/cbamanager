const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("A=e.events[c]");let j=s.lastIndexOf("function ",i);console.log(j,i-j);console.log(JSON.stringify(s.slice(j,j+700)));
