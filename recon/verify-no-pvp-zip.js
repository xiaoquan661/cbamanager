const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const zip = "C:/10.19源码/签下整个CBA/dist/cba-lamps-upload.zip";
const out = "C:/10.19源码/签下整个CBA/dist/_verify_tmp";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zip}' -DestinationPath '${out}' -Force"`, { stdio: "inherit" });

const glue = fs.readFileSync(path.join(out, "assets/lamps/cba-lamps-glue.js"), "utf8");
const js = fs.readFileSync(path.join(out, "cba-startup.js"), "utf8");
const html = fs.readFileSync(path.join(out, "index.html"), "utf8");
console.log("glue VERSION:", (glue.match(/var VERSION = '([^']+)'/) || [])[1]);
console.log("bundle 含 cover-pvp:", js.includes("cover-pvp"));
console.log("bundle 含 PVPSYNC:", js.includes("__CBA_PVPSYNC__"));
console.log("glue 含 CBASquadShare:", glue.includes("CBASquadShare"));
console.log("index 含 squad-share:", html.includes("squad-share"));
console.log("squad-share 文件存在:", fs.existsSync(path.join(out, "assets/lamps/cba-squad-share-r29.js")));
console.log("rank dataLoad 含 lineup:", fs.readFileSync(path.join(out, "assets/lamps/cba-rank-sync.js"), "utf8").includes("lineup"));

let files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|html|json|css)$/i.test(e.name)) files.push(p);
  }
})(out);
let bad = [];
for (const f of files) {
  if (f.endsWith("player-feed.json")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (/\bXMLHttpRequest\b|(?<![.\w])fetch\s*\(/.test(t)) bad.push(["XHR/fetch", path.relative(out, f)]);
  if (/tencentscf\.com/.test(t)) bad.push(["SCF", path.relative(out, f)]);
  const urls = t.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  for (const u of urls) if (!/hoorahgo\.com|w3\.org|localhost/.test(u)) bad.push(["外域 " + u.slice(0, 50), path.relative(out, f)]);
}
console.log("扫描文件:", files.length);
console.log(bad.length ? "⚠ " + JSON.stringify(bad.slice(0, 10)) : "✓ 网络与域名检查通过");
fs.rmSync(out, { recursive: true, force: true });
