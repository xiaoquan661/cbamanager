const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
function rep(oldText,newText){const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c,oldText.slice(0,90));process.exit(1);}s=s.split(oldText).join(newText);}
rep("const active = tab !== 'coaches' && (sort === id || id === 'ability' && sort === 'abilityLow' || id === 'up' && sort === 'down' || id === 'high' && sort === 'low'); return h('button'",
    "const active = tab !== 'coaches' && (sort === id || id === 'ability' && sort === 'abilityLow' || id === 'up' && sort === 'down' || id === 'high' && sort === 'low'); const asc = id === 'ability' && sort === 'abilityLow' || id === 'up' && sort === 'down' || id === 'high' && sort === 'low'; return h('button'");
rep("}, label); }), h('button', { role: 'tab', 'aria-selected': tab === 'coaches'",
    "}, label, active ? h('span', { className: 'cba-sort-arrow', 'aria-hidden': 'true' }, asc ? '↑' : '↓') : null); }), h('button', { role: 'tab', 'aria-selected': tab === 'coaches'");
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
