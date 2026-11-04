const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const k of ["dangerouslySetInnerHTML:", "{dangerouslySetInnerHTML", "srcdoc", "<iframe", "window.open(", "target:`_blank`", "location.href=", "location.replace(", "location.assign("]) {
  console.log(k + ": " + (j.split(k).length - 1));
}