// verify-official-feed-zip.js — 校验上传包内一致性与网络门禁
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const zip = "C:/10.19源码/签下整个CBA/dist/cba-lamps-upload.zip";
const out = "C:/10.19源码/签下整个CBA/dist/_verify_tmp";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zip}' -DestinationPath '${out}' -Force"`, { stdio: "inherit" });

const glue = fs.readFileSync(path.join(out, "assets/lamps/cba-lamps-glue.js"), "utf8");
console.log("glue 版本:", (glue.match(/var VERSION = '([^']+)'/) || [])[1]);
console.log("含 installOfficialFeedSync:", glue.includes("installOfficialFeedSync"));
console.log("含 official-feed URL:", glue.includes("official-feed"));
console.log("index 引用版本:", (fs.readFileSync(path.join(out, "index.html"), "utf8").match(/cba-lamps-glue\.js\?v=([^"']+)/) || [])[1]);

let files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|html|json)$/i.test(e.name)) files.push(p);
  }
})(out);

let bad = [];
const allow = /lamps-api\.hoorahgo\.com/;
for (const f of files) {
  if (f.endsWith("player-feed.json")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (/\bXMLHttpRequest\b|(?<![.\w])fetch\s*\(/.test(t)) bad.push(["XHR/fetch", path.relative(out, f)]);
  const urls = t.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  for (const u of urls) {
    if (!/hoorahgo\.com|w3\.org|schemas|localhost/.test(u) && !allow.test(u)) bad.push(["外域 " + u.slice(0, 60), path.relative(out, f)]);
  }
  if (/tencentscf\.com/.test(t)) bad.push(["残留SCF", path.relative(out, f)]);
}
console.log("扫描文件数:", files.length);
if (bad.length) { console.log("⚠ 发现问题:"); bad.slice(0, 20).forEach(b => console.log("  ", b[0], "→", b[1])); }
else console.log("✓ 无 XHR/fetch、无 tencentscf、无未备案外域");
fs.rmSync(out, { recursive: true, force: true });
