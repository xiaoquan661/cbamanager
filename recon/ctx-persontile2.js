const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const a=s.indexOf("function PersonTile(");
const b=s.indexOf("function CoachTile(",a);
console.log("len",b-a);
console.log(JSON.stringify(s.slice(a,b)));
