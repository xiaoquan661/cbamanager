const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("return h('section', { className: 'fantasy-market fantasy-page'");
console.log(JSON.stringify(s.slice(i,i+1600)));
