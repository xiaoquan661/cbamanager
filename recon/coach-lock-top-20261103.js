const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
const oldText="return(0,D.jsxs)(`section`,{className:`coach-center`,children:[\r\n  (0,D.jsxs)(`div`,{className:`coach-current`,children:[";
const newText="return(0,D.jsxs)(`section`,{className:`coach-center`,children:[\r\n  e.pendingMatch&&(0,D.jsx)(`p`,{className:`fantasy-note cba-coach-lock`,role:`status`},`比赛进行中不能更换主教练，请先完成当前比赛。`),\r\n  (0,D.jsxs)(`div`,{className:`coach-current`,children:[";
const c=s.split(oldText).length-1;
if(c!==1){console.error("MATCH",c);process.exit(1);}
s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
