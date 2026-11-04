const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const i=s.indexOf("const VERSION = 'home-tour-r275-v1'");
console.log(JSON.stringify(s.slice(i,i+7000)));
