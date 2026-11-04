const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
let i = -1, n = 0;
while ((i = css.indexOf("tp-icon", i + 1)) >= 0 && n < 30) {
  const tail = css.slice(i, i + 260);
  if (/filter|opacity|selected|invert/.test(tail)) { console.log("@" + i + " " + tail); console.log("---"); n++; }
}
console.log("total tp-icon refs:", (css.match(/tp-icon/g) || []).length);
