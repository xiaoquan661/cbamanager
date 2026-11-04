const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
function cut(aMark,bMark){
  const a=s.indexOf(aMark); const b=s.indexOf(bMark,a);
  if(a<0||b<0){console.error("cut fail",a,b);process.exit(1);}
  s=s.slice(0,a)+s.slice(b);
}
function rep(oldText,newText){const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c,oldText.slice(0,80));process.exit(1);}s=s.split(oldText).join(newText);}
// 删除顶部两个榜单区块
cut("        tab !== 'mine' && tab !== 'coaches' && h(React.Fragment,null,", "        h('div', { className: 'fantasy-toolbar' }");
// 合并排序标签，点击同一标签切换正/倒序
rep("h('div', { className: 'fantasy-sort', role: 'tablist', 'aria-label': '球员排序与教练' }, [['ability', '能力'], ['up', '轮涨幅'], ['down', '轮跌幅'], ['high', '高价'], ['low', '低价']].map(([id, label]) => h('button', { key: id, role: 'tab', 'aria-selected': tab !== 'coaches' && sort === id, className: tab !== 'coaches' && sort === id ? 'active' : '', onClick: () => { if(id==='up'||id==='down'){showRound(id);return;} setSort(id); if (tab === 'coaches') { setTab('all'); setTeam('全部球队'); } } }, label)),",
    "h('div', { className: 'fantasy-sort', role: 'tablist', 'aria-label': '球员排序与教练' }, [['ability', '能力'], ['up', '涨跌幅'], ['high', '价格']].map(([id, label]) => { const active = tab !== 'coaches' && (sort === id || id === 'ability' && sort === 'abilityLow' || id === 'up' && sort === 'down' || id === 'high' && sort === 'low'); return h('button', { key: id, role: 'tab', title: '点击切换正序 / 倒序', 'aria-selected': active, className: active ? 'active' : '', onClick: () => { if (id === 'ability') setSort(sort === 'ability' ? 'abilityLow' : 'ability'); else if (id === 'up') setSort(sort === 'up' ? 'down' : 'up'); else if (id === 'high') setSort(sort === 'high' ? 'low' : 'high'); if (tab === 'coaches') { setTab('all'); setTeam('全部球队'); } } }, label); }),");
// 排序比较器支持能力正序
rep("sort === 'high' ? price(b) - price(a) : sort === 'low' ? price(a) - price(b) : Number(b.ability || b.rating || 0) - Number(a.ability || a.rating || 0)",
    "sort === 'high' ? price(b) - price(a) : sort === 'low' ? price(a) - price(b) : sort === 'abilityLow' ? Number(a.ability || a.rating || 0) - Number(b.ability || b.rating || 0) : Number(b.ability || b.rating || 0) - Number(a.ability || a.rating || 0)");
// 规则文案同步
rep("h('p',null,'涨幅与跌幅分别显示前三名，点击榜名查看完整排名。比例相同时，先按金币变动绝对值，再按球员编号排序。')",
    "h('p',null,'点击「涨跌幅」可在涨幅与跌幅排序之间切换，再次点击同一标签切换正序与倒序；能力与价格同理。比例相同时，先按金币变动绝对值，再按球员编号排序。')");
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
