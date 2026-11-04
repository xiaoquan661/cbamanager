const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["cover-pvp", "__CBA_PVPSYNC__"]) {
  let i = js.indexOf(key), c = 0;
  while (i >= 0 && c < 6) {
    console.log("\n=== " + key + " @" + i + " ===");
    console.log(js.slice(Math.max(0, i - 700), i + 700));
    i = js.indexOf(key, i + key.length); c++;
  }
}
console.log("\ncover-pvp count:", (js.match(/cover-pvp/g) || []).length);
console.log("PVPSYNC count:", (js.match(/__CBA_PVPSYNC__/g) || []).length);
