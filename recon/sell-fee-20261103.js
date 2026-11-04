// 卖出手续费：按当前市场价的 90% 回收（10% 手续费）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

const bundlePath = root + "cba-startup.js";
let js = fs.readFileSync(bundlePath, "utf8");
let hits = 0;
function swap(from, to, label) {
  if (!js.includes(from)) { console.log("WARN 未匹配:", label); return; }
  js = js.split(from).join(to);
  hits++;
}

/* 1. 价格说明 + 统一 helper */
swap(
`  function pricingDescription(quote) {
    if (quote?.discount < 1) return '每日商店限时折扣价；卖出按当前市场价格回收。';
    return abilityPriceRules(quote) ? '首场有效比赛为基准；能力每相差20点范特西指数变动1点（1–99），身价按指数差联动，表现下降不涨价；商店 D 类合同与外援可享 7–9 折。' : '市场价格随真实比赛更新；商店 D 类合同与外援可享 7–9 折。';
  }`,
`  function sellProceeds(price) {
    const value = Number(price);
    return Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value * 0.9)) : 0;
  }
  function pricingDescription(quote) {
    if (quote?.discount < 1) return '每日商店限时折扣价；卖出按当前市场价的 90% 回收（10% 手续费）。';
    return abilityPriceRules(quote) ? '首场有效比赛为基准；能力每相差20点范特西指数变动1点（1–99），身价按指数差联动，表现下降不涨价；商店 D 类合同与外援可享 7–9 折；卖出按当前市场价的 90% 回收（10% 手续费）。' : '市场价格随真实比赛更新；商店 D 类合同与外援可享 7–9 折；卖出按当前市场价的 90% 回收（10% 手续费）。';
  }`,
"pricingDescription"
);

/* 2. 导出 helper */
swap(
`root.CBAFantasyUI = { create, displayEntityQuote, compatibleQuote, pricingLabel, pricingDescription, createPredictionBalanceSync, priceBaseline, priceTrend, baselineChangePct, refreshMarket };`,
`root.CBAFantasyUI = { create, displayEntityQuote, compatibleQuote, pricingLabel, pricingDescription, sellProceeds, createPredictionBalanceSync, priceBaseline, priceTrend, baselineChangePct, refreshMarket };`,
"export"
);

/* 3. 结算：按 90% 到账 */
swap(
`          next[field]=next[field].filter(x=>x.uid!==c.uid);next.coins+=q.price;
          if(isCoach&&next.activeCoachUid===c.uid)next.activeCoachUid=null;
          if(!isCoach){next.lineup=next.lineup.filter(x=>x!==c.uid);next.lineupSlots=next.lineupSlots.map(x=>x===c.uid?'':x);}
          next.result={kind:'r13-sale',title:'出售完成',message:q.name+' · 到账 '+q.price+'金币',cards:[],coins:q.price};`,
`          const proceeds=Math.max(1,Math.round(q.price*0.9));
          next[field]=next[field].filter(x=>x.uid!==c.uid);next.coins+=proceeds;
          if(isCoach&&next.activeCoachUid===c.uid)next.activeCoachUid=null;
          if(!isCoach){next.lineup=next.lineup.filter(x=>x!==c.uid);next.lineupSlots=next.lineupSlots.map(x=>x===c.uid?'':x);}
          next.result={kind:'r13-sale',title:'出售完成',message:q.name+' · 到账 '+proceeds+'金币',cards:[],coins:proceeds};`,
"sell settlement"
);

/* 4. 市场详情卖出弹窗 */
swap(
`h('p', null, '卖出 ' + sale.name + '，返还 ' + money(sale.price) + ' 金币。'), h('p', { className: 'fantasy-note' }, '按当前签约价回收。卖出后会从你的阵容或执教席移除。')`,
`h('p', null, '卖出 ' + sale.name + '，返还 ' + money(sellProceeds(sale.price)) + ' 金币。'), h('p', { className: 'fantasy-note' }, '按当前市场价的 90% 回收（10% 手续费）。卖出后会从你的阵容或执教席移除。')`,
"market sale modal"
);

/* 5. 每日商店卖出弹窗 */
swap(
`h('p', null, '卖出 ' + sale.name + '，返还 ' + money(sale.price) + ' 金币。'), h('p', { className: 'fantasy-note' }, '按当前签约市场价格回收。卖出后会从你的阵容移除。')`,
`h('p', null, '卖出 ' + sale.name + '，返还 ' + money(sellProceeds(sale.price)) + ' 金币。'), h('p', { className: 'fantasy-note' }, '按当前市场价的 90% 回收（10% 手续费）。卖出后会从你的阵容移除。')`,
"shop sale modal"
);

fs.writeFileSync(bundlePath, js, "utf8");
console.log("bundle bytes", fs.statSync(bundlePath).size, "patches", hits);

/* 6. 游戏说明文案 */
const gluePath = root + "assets/lamps/cba-lamps-glue.js";
let glue = fs.readFileSync(gluePath, "utf8");
const guideFrom = "签约市场价格每天 00:00 按真实赛果更新；当天没有新赛果时维持前值。卖出按当前市场价回收。";
const guideTo = "签约市场价格每天 00:00 按真实赛果更新；当天没有新赛果时维持前值。卖出按当前市场价的 90% 回收（10% 手续费）。";
if (glue.includes(guideFrom)) {
  glue = glue.replace(guideFrom, guideTo);
  fs.writeFileSync(gluePath, glue, "utf8");
  console.log("guide updated");
} else {
  console.log("WARN guide 未匹配");
}
