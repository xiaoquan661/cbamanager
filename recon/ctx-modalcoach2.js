const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
let i=s.indexOf("h(Modal, { title: '教练签约'");
console.log(JSON.stringify(s.slice(i-60,i+700)));
