const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(p, "utf8");

/* 1. 在 pricingDescription 前补 sellProceeds，并更新说明（CRLF 安全） */
const start = js.indexOf("  function pricingDescription(quote) {");
const end = js.indexOf("  function remoteContext() {", start);
if (start < 0 || end < 0) {
  console.log("WARN pricingDescription block not found");
} else {
  const block = [
    "  function sellProceeds(price) {",
    "    const value = Number(price);",
    "    return Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value * 0.9)) : 0;",
    "  }",
    "  function pricingDescription(quote) {",
    "    if (quote?.discount < 1) return '每日商店限时折扣价；卖出按当前市场价的 90% 回收（10% 手续费）。';",
    "    return abilityPriceRules(quote) ? '首场有效比赛为基准；能力每相差20点范特西指数变动1点（1–99），身价按指数差联动，表现下降不涨价；商店 D 类合同与外援可享 7–9 折；卖出按当前市场价的 90% 回收（10% 手续费）。' : '市场价格随真实比赛更新；商店 D 类合同与外援可享 7–9 折；卖出按当前市场价的 90% 回收（10% 手续费）。';",
    "  }",
    "",
  ].join("\r\n");
  js = js.slice(0, start) + block + js.slice(end);
  console.log("pricingDescription replaced");
}

/* 2. 结算按 90% 到账 */
const oldLine = "next[field]=next[field].filter(x=>x.uid!==c.uid);next.coins+=q.price;";
const newLine = "const proceeds=Math.max(1,Math.round(q.price*0.9));\r\n          next[field]=next[field].filter(x=>x.uid!==c.uid);next.coins+=proceeds;";
if (js.includes(oldLine)) js = js.split(oldLine).join(newLine);
else console.log("WARN coin line not found");
const oldMsg = "message:q.name+' · 到账 '+q.price+'金币',cards:[],coins:q.price";
const newMsg = "message:q.name+' · 到账 '+proceeds+'金币',cards:[],coins:proceeds";
if (js.includes(oldMsg)) js = js.split(oldMsg).join(newMsg);
else console.log("WARN message not found");

fs.writeFileSync(p, js, "utf8");
console.log("bytes", fs.statSync(p).size);
console.log("sellProceeds count", (js.match(/sellProceeds/g) || []).length, "proceeds count", (js.match(/proceeds/g) || []).length);
