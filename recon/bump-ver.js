// bump-ver.js — 升版本号
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const VER = "20261030i-ux-motion";
const f = root + "index.html";
let raw = fs.readFileSync(f, "utf8");
raw = raw.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
raw = raw.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
fs.writeFileSync(f, raw, "utf8");
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
console.log("版本 → " + VER);