// 新账户开局金币统一为 500
const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");
const pairs = [
  ['"openingCoins":1000', '"openingCoins":500'],
  ["openingCoins:1000", "openingCoins:500"],
];
for (const [a, b] of pairs) {
  const n = js.split(a).length - 1;
  console.log(a, "→", b, "替换", n);
  js = js.split(a).join(b);
}
const left = js.split("openingCoins").length - 1;
console.log("剩余 openingCoins 出现:", left);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }

const fs2 = require("fs");
const c = fs2.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log("OPENING_COINS =", /OPENING_COINS = (\d+)/.exec(c)[1]);