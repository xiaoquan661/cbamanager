const fs=require("fs");
const s=fs.readFileSync("assets/sprites/sprite-03.js","utf8");
const idx=s.indexOf("i0293");
console.log(JSON.stringify(s.slice(idx-80,idx+80)));
const re=/<image[^>]*?id=\\?"(i\d+)\\?"[^>]*?href=\\?"(data:image\/(webp|png);base64,[^"\\]+)\\?"/g;
let m,n=0;while((m=re.exec(s))&&n<3){console.log(m[1],m[3],m[2].length);n++;}
