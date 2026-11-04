const fs = require("fs");
const j = fs.readFileSync("cba-startup.js", "utf8");
let i = j.indexOf("EXISTING_ACCOUNT_RESET");
console.log(j.slice(Math.max(0, i - 2500), i + 2500).replace(/\s+/g, " "));