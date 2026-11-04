// restore-index.js — 从旧包恢复 index.html，并应用去 PVP + 新版本号
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const VER = "20261103a-no-pvp";

let html = fs.readFileSync(root + "recon/index-from-zip.html", "utf8");
html = html.replace(/\s*<script defer src="assets\/lamps\/cba-squad-share-r29\.js\?v=[^"]*"><\/script>/, "");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
html = html.replace(/cba-rank-sync\.js\?v=[^"']+/, "cba-rank-sync.js?v=" + VER);
const cssSize = fs.statSync(root + "cba-startup.css").size;
html = html.replace(/("url":"cba-startup\.css\?v=[^"]+","bytes":)\d+/, '$1' + cssSize);
fs.writeFileSync(root + "index.html", html, "utf8");
fs.copyFileSync(root + "index.html", root + "dist/stage/index.html");

const checks = {
  "squad-share removed": !html.includes("squad-share"),
  "glue version": html.includes("cba-lamps-glue.js?v=" + VER),
  "css version": html.includes("cba-startup.css?v=" + VER),
  "rank version": html.includes("cba-rank-sync.js?v=" + VER),
  "css bytes": html.includes('"bytes":' + cssSize),
};
for (const [k, v] of Object.entries(checks)) console.log((v ? "✓ " : "✗ ") + k);
console.log("index 大小:", Buffer.byteLength(html, "utf8"));
if (Object.values(checks).some(v => !v)) process.exit(1);
