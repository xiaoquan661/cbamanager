const fs=require("fs");
const s=fs.readFileSync("cba-startup.css","utf8");
for(const p of ["cover-recruit-cta","cover-cta","cover-foot","cover-shop-heading"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-200),i+400)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
