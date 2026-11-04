const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA/dist/stage";
const needles = ["1528", "cba-679408", "lastSettledMatchId", "practiceCheckin", "myTransactions", "\"coins\":"];
function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|json|html|css)$/i.test(name)) out.push(p);
  }
  return out;
}
const files = walk(root, []);
console.log("files:", files.length);
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  const hits = needles.filter(n => s.includes(n));
  if (hits.length) console.log(path.relative(root, f), "->", hits.join(", "));
}