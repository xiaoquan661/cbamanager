const fs=require("fs");const s=fs.readFileSync("assets/sprites/sprite-home.js","utf8");
const re=/<image[^>]*?id=\\?"(i0105)\\?"[^>]*?width=\\?"(\d+)\\?"[^>]*?height=\\?"(\d+)\\?"[^>]*?href=\\?"(data:image\/(webp|png);base64,[^"\\]+)\\?"/g;
let m=re.exec(s);if(!m){console.error("missing");process.exit(1);}
const buf=Buffer.from(m[4].slice(m[4].indexOf(",")+1),"base64");fs.writeFileSync("assets/teams/t252."+m[5],buf);
console.log(m[1],m[2]+"x"+m[3],m[5],buf.length,"assets/teams/t252."+m[5]);
