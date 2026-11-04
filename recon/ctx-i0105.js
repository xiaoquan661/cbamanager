const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf('"i0105"');console.log("config idx",i,JSON.stringify(s.slice(i-80,i+120)));
