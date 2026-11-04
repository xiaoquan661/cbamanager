const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA/dist/stage";
function walk(dir, out) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|html)$/i.test(n)) out.push(p);
  }
  return out;
}
const patterns = [
  ["fetch(", /(^|[^.\w])fetch\s*\(/],
  ["XMLHttpRequest", /XMLHttpRequest/],
  ["WebSocket", /WebSocket/],
  ["eval(", /(^|[^.\w])eval\s*\(/],
  ["new Function", /new\s+Function\s*\(/],
  ["document.write", /document\.write/],
  ["iframe", /<iframe|createElement\(['"]iframe/i],
  ["window.open", /window\.open\s*\(/],
  ["_blank", /_blank/],
  ["geolocation", /navigator\.geolocation/],
  ["clipboard", /navigator\.clipboard/],
  ["device motion", /DeviceMotionEvent|DeviceOrientationEvent/],
  ["auth_key", /auth_key/],
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["innerHTML", /\.innerHTML\s*=/],
  ["outerHTML", /\.outerHTML\s*=/],
  ["postMessage", /postMessage\s*\(/],
  ["http url", /https?:\/\/[^"'`\s)]+/g],
];
const files = walk(root, []);
for (const [label, re] of patterns) {
  const hits = [];
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(s)) && hits.length < 30) {
      const line = s.slice(0, m.index).split("\n").length;
      hits.push(path.relative(root, f) + ":" + line + "  " + s.slice(Math.max(0, m.index - 40), m.index + 80).replace(/\s+/g, " "));
    }
  }
  if (hits.length) console.log("\n### " + label + " (" + hits.length + ")\n" + hits.join("\n"));
}