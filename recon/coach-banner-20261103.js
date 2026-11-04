const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
function rep(oldText,newText){const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c,oldText.slice(0,60));process.exit(1);}s=s.split(oldText).join(newText);}
rep("h('div', { className: 'fantasy-market-caption' }",
    "currentGame.pendingMatch && h('p', { className: 'fantasy-note cba-market-lock', role: 'status' }, '比赛进行中，暂不能签约或出售；请先完成当前比赛。'),\r\n        h('div', { className: 'fantasy-market-caption' }");
rep("h('div', { className: 'fantasy-coach-detail' }, h(Avatar, { entity: selected })",
    "h('div', { className: 'fantasy-coach-detail' }, currentGame.pendingMatch && h('p', { className: 'fantasy-note cba-coach-lock', role: 'status' }, '比赛进行中不能签约教练，请先完成当前比赛。'), h(Avatar, { entity: selected })");
rep("function sign() {\r\n        if (!selected || unavailable",
    "function sign() {\r\n        if (currentGame.pendingMatch) { setNotice('比赛进行中不能签约教练，请先完成当前比赛。'); return; }\r\n        if (!selected || unavailable");
rep("disabled: unavailable || !selected.quoteReady, onClick: sign",
    "disabled: unavailable || !selected.quoteReady || !!currentGame.pendingMatch, onClick: sign");
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
