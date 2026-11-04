const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const VER = "20261103unify-internal22";

let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");

let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
html = html.replace(/cba-rank-sync\.js\?v=[^"']+/, "cba-rank-sync.js?v=" + VER);
html = html.replace(/cba-daily-tasks\.js\?v=[^"']+/, "cba-daily-tasks.js?v=17");
html = html.replace(/cba-launch\.js\?v=[^"']+/, "cba-launch.js?v=" + VER);
const cssSize = fs.statSync(root + "cba-startup.css").size;
html = html.replace(/("url":"cba-startup\.css\?v=[^"]+","bytes":)\d+/, "$1" + cssSize);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("version ->", VER, "CSS bytes", cssSize);

















