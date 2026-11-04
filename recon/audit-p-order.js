const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
for (const k of ["var P_=", "P_=[", "const P_=", "P_ = ["]) {
  const i = j.indexOf(k);
  console.log(k + " at " + i);
  if (i >= 0) console.log(j.slice(i, i + 2000).replace(/\s+/g, " "));
}