const fs = require("fs");
const j = fs.readFileSync("dist/stage/cba-startup.js", "utf8");
console.log("OPENING_COINS:", /OPENING_COINS = (\d+)/.exec(j)[1]);
console.log("config openingCoins 1000 出现:", (j.split('"openingCoins":1000').length - 1) + (j.split("openingCoins:1000").length - 1));
console.log("config openingCoins 500 出现:", (j.split('"openingCoins":500').length - 1) + (j.split("openingCoins:500").length - 1));
console.log("zip:", fs.statSync("dist/cba-lamps-upload.zip").size);