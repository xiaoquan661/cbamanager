const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
function rep(oldText,newText){const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c,oldText.slice(0,80));process.exit(1);}s=s.split(oldText).join(newText);}
rep("function PersonTile({ p, small, minimal, showAbility, selected, onClick, badge, dragId, onDropCard })",
    "function PersonTile({ p, small, minimal, showAbility, captionAbility, selected, onClick, badge, dragId, onDropCard })");
rep("const abilityVisible = minimal || showAbility;",
    "const abilityVisible = minimal || showAbility;");
rep("const abilityValue = abilityVisible ? root.CBAFantasyPricing.getPlayer(p.id)?.ability ?? p.rating : null;",
    "const abilityValue = (abilityVisible || captionAbility) ? root.CBAFantasyPricing.getPlayer(p.id)?.ability ?? p.rating : null;");
rep("'aria-label': p.name + ' · ' + p.team + (abilityVisible ? ' · 能力 ' + ability : '') + (!minimal && quoted ? ' · ' + pricingLabel(quoted) + ' ' + quoted.price + ' 金币' : '')",
    "'aria-label': p.name + ' · ' + p.team + (abilityVisible || captionAbility ? ' · 能力 ' + ability : '') + (!minimal && quoted && !captionAbility ? ' · ' + pricingLabel(quoted) + ' ' + quoted.price + ' 金币' : '')");
rep("h('span', { className: 'fantasy-tile-caption' }, h('strong', null, p.name), !minimal && quoted && h('b', { className: 'fantasy-tile-price', title: pricingLabel(quoted) + ' · ' + pricingDescription(quoted) }, money(quoted.price))),",
    "h('span', { className: 'fantasy-tile-caption' }, h('strong', null, p.name), captionAbility ? h('b', { className: 'fantasy-tile-price', title: '能力' }, ability) : !minimal && quoted && h('b', { className: 'fantasy-tile-price', title: pricingLabel(quoted) + ' · ' + pricingDescription(quoted) }, money(quoted.price))),");
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
