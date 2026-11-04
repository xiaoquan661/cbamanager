const fs=require("fs");const path=require("path");
const dir="assets/sprites";
const files=fs.readdirSync(dir).filter(f=>/^sprite-\d+\.js$/.test(f));
const targets={i0264:244,i0794:245,i0589:246,i0385:247,i0277:248,i0282:249,i0467:250,i0381:251,i0105:252,i0280:253,i0352:254,i0279:255,i0397:256,i0289:257,i0334:258,i0293:259,i0274:260,i0284:261,i0388:262,i0599:263};
const found={};
const re=/<image[^>]*?id=\\?"(i\d+)\\?"[^>]*?width=\\?"(\d+)\\?"[^>]*?height=\\?"(\d+)\\?"[^>]*?href=\\?"(data:image\/(webp|png);base64,[^"\\]+)\\?"/g;
for(const f of files){
 const s=fs.readFileSync(path.join(dir,f),"utf8");
 let m;while((m=re.exec(s))){
  const id=m[1];if(!(id in targets))continue;
  if(found[id]){console.error("DUP",id);continue;}
  found[id]={file:f,width:+m[2],height:+m[3],mime:m[5],data:m[4]};
 }
}
fs.mkdirSync("assets/teams",{recursive:true});
let total=0;
for(const [id,idx] of Object.entries(targets)){
 const v=found[id];if(!v){console.error("MISSING",id,idx);continue;}
 const comma=v.data.indexOf(",");const b64=v.data.slice(comma+1);const buf=Buffer.from(b64,"base64");
 const out=`assets/teams/t${idx}.${v.mime}`;fs.writeFileSync(out,buf);total+=buf.length;
 console.log(id,idx,v.file,v.width+"x"+v.height,v.mime,buf.length,out);
}
console.log("TOTAL",total);
