const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
console.log("count", (s.split('"directAssets":{').length-1));
