const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["function Iv(","Iv=","logoFor=","function logoFor","teamLogo:("]){
 const i=s.indexOf(p);console.log("=== "+p,i);if(i>=0)console.log(JSON.stringify(s.slice(i-300,i+700)));
}
