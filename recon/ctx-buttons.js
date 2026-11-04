const fs=require("fs");const s=fs.readFileSync("cba-startup.js","utf8");
for(const p of ["disabled: unavailable || !selected.quoteReady, onClick: sign","disabled: unavailable || !selected.quoteReady, onClick: () => setSaleState"]){console.log(p, (s.split(p).length-1));}
