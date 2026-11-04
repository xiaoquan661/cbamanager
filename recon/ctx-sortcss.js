const fs=require("fs");
const s=fs.readFileSync("cba-startup.css","utf8");
let i=0,n=0;while((i=s.indexOf(".fantasy-sort",i))>=0&&n<8){console.log(JSON.stringify(s.slice(i-80,i+700)));i+=10;n++;}
