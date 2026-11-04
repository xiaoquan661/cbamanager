const fs = require("fs");
for (const file of ["cba-startup.js", "assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-daily-tasks.js"]) {
  const s = fs.readFileSync("C:/10.19源码/签下整个CBA/" + file, "utf8");
  console.log("\n=== " + file + " dailyCheckin x" + (s.split("dailyCheckin").length - 1));
  let i = -1, n = 0;
  while ((i = s.indexOf("dailyCheckin", i + 1)) >= 0 && n < 5) {
    console.log(s.slice(Math.max(0, i - 220), i + 160).replace(/\s+/g, " "));
    n++;
  }
}