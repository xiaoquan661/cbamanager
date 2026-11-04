const fs = require("fs");
const g = fs.readFileSync("assets/lamps/cba-lamps-glue.js", "utf8");
const j = fs.readFileSync("cba-startup.js", "utf8");
const c = fs.readFileSync("cba-startup.css", "utf8");
const z = fs.readFileSync("dist/cba-lamps-upload.zip");
console.log("glue adCoinReward:", g.includes("adCoinReward"), "| cba-coin-ad:", g.includes("cba-coin-ad"));
console.log("bundle adCoinReward:", j.includes("adCoinReward"), "| openingCoins 1000:", j.split("openingCoins\":1000").length - 1 + j.split("openingCoins:1000").length - 1);
console.log("css rewards-bg marker:", c.includes("rewards-bg: 20261103"), "| page transparent:", c.includes(".cba-rewards-page{background:transparent"));
console.log("zip bytes:", z.length);