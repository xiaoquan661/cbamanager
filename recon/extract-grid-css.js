const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const re = /([^{}]*cover-(?:market|fusion|recruit|season|pvp|ranking|team)[^{}]*)\{([^}]*)\}/g;
let m, n = 0;
while ((m = re.exec(css)) && n < 40) {
  const sel = m[1].replace(/\s+/g, " ").trim();
  const body = m[2];
  if (/grid-area|grid-column|grid-row/.test(body)) {
    console.log(sel, "=>", (body.match(/grid-(?:area|column|row)[^;]*/g) || []).join("; "));
    n++;
  }
}
console.log("rules with placement:", n);
