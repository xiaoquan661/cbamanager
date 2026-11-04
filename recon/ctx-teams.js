const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("window.__CBA_TEAMS__=Fv");console.log(JSON.stringify(s.slice(i-2600,i+120)));
