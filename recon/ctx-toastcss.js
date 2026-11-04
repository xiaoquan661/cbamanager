const fs=require("fs");
const s=fs.readFileSync("cba-startup.css","utf8");
let i=0;while((i=s.indexOf(".game-toast",i))>=0){console.log(JSON.stringify(s.slice(i-200,i+500)));i+=10;}
