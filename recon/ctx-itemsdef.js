const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("const ITEMS");if(i<0)i=s.indexOf("var ITEMS");console.log("idx",i);console.log(JSON.stringify(s.slice(i-500,i+1200)));
