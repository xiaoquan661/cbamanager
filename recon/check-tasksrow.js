const fs = require("fs");
const d = fs.readFileSync("dist/stage/assets/lamps/cba-daily-tasks.js", "utf8");
const c = fs.readFileSync("dist/stage/cba-startup.css", "utf8");
const h = fs.readFileSync("dist/stage/index.html", "utf8");
console.log("daily entry:", d.includes("daily-task-entry") && d.includes("每日任务</b>"));
console.log("4col css:", c.includes("daily-entry: 20261103"));
console.log("index tasks v10:", h.includes("cba-daily-tasks.js?v=10"));
console.log("css ver:", (h.match(/cba-startup\.css\?v=([^"']+)/) || [])[1]);