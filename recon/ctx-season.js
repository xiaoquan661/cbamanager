const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const re=/[\u4e00-\u9fa5“”「」：，。·…—0-9A-Za-z／%+\- ]{0,24}(赛季|进行中|开赛后|开赛|更换)[\u4e00-\u9fa5“”「」：，。·…—0-9A-Za-z／%+\- ]{0,30}/g;
const set=new Set();let m;
while((m=re.exec(s))&&set.size<200){set.add(m[0].trim());}
console.log([...set].join("\n"));
