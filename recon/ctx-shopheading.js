const fs=require("fs");
const s=fs.readFileSync("cba-startup.css","utf8");
let i=0,n=0;
while((i=s.indexOf(".cover-shop-heading",i))>=0&&n<12){
 const start=Math.max(0,i-400);
 console.log("---",n++);
 console.log(JSON.stringify(s.slice(start,i+500)));
 i+=10;
}
