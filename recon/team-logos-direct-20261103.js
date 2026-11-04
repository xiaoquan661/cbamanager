const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
const map={i0264:244,i0794:245,i0589:246,i0385:247,i0277:248,i0282:249,i0467:250,i0381:251,i0105:252,i0280:253,i0352:254,i0279:255,i0397:256,i0289:257,i0334:258,i0293:259,i0274:260,i0284:261,i0388:262,i0599:263};
let entries="";
for(const [id,idx] of Object.entries(map)) entries+='"'+id+'":"assets/teams/t'+idx+'.webp",';
const oldText='"directAssets":{';
const c=s.split(oldText).length-1;
if(c!==1){console.error("MATCH",c);process.exit(1);}
s=s.split(oldText).join('"directAssets":{'+entries);
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
