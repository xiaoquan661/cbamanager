const fs=require("fs");const s=fs.readFileSync("assets/sprites/sprite-03.js","utf8");
let i=s.indexOf("i0293");console.log("idx",i,"len",s.length);
console.log(JSON.stringify(s.slice(Math.max(0,i-300),i+500)));
