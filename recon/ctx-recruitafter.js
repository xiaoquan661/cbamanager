const fs=require("fs");
const s=fs.readFileSync("cba-startup.css","utf8");
for(const p of ["cover-recruit::after","cover-recruit:after","cover-recruit>img","cover-tile::after"]){
 let i=0,n=0;console.log("=== "+p);
 while((i=s.indexOf(p,i))>=0&&n<6){console.log(JSON.stringify(s.slice(Math.max(0,i-160),i+300)));i+=p.length;n++;}
 if(!n)console.log("(none)");
}
