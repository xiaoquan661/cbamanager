const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
for(const [a,b] of [["`再战一会 `","`进行下一轮 `"],["`返回征战之路 `","`返回大厅 `"]]){
 const c=s.split(a).length-1;if(c!==1){console.error("MATCH",a,c);process.exit(1);}s=s.split(a).join(b);
}
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
