const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/assets/avatars-r12/team-06-part-01-9885f1d2774c.js";
const s = fs.readFileSync(p, "utf8");
const m = s.match(/"i0954":"data:image\/(\w+);base64,([^"]+)"/);
if (!m) { console.log("nf"); process.exit(0); }
const ext = m[1] === "jpeg" ? "jpg" : m[1];
const out = "C:/10.19源码/签下整个CBA/recon/portrait-i0954." + ext;
fs.writeFileSync(out, Buffer.from(m[2], "base64"));
console.log(out, fs.statSync(out).size);
