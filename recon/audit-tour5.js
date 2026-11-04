const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const a = j.indexOf("const VERSION = 'home-tour-r275-v1'");
const b = j.indexOf("})(typeof window", a);
const mod = j.slice(a, b);
for (const k of ["function draw", "function next", "function schedule", "function attempt", "function start", "isFresh(", "queued", "layer.hidden = false", "show(", "step.selector", "querySelector"]) {
  let i = mod.indexOf(k);
  console.log("\n### " + k + " @" + i);
  if (i >= 0) console.log(mod.slice(Math.max(0, i - 500), i + 1200).replace(/\s+/g, " "));
}