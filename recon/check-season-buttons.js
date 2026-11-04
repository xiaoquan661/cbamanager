const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["再战一会","返回征战之路","进行下一轮","返回大厅"]){console.log(p,(s.split(p).length-1));}
