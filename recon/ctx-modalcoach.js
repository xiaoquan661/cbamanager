const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("selected && (selected.kind === 'coach'");
console.log(JSON.stringify(s.slice(i,i+700)));
