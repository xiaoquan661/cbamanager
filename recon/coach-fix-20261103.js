const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
let n=0;
function rep(oldText,newText){
  const c=s.split(oldText).length-1;
  if(c!==1){console.error("MATCH",c,"for",oldText.slice(0,70));process.exit(1);}
  s=s.split(oldText).join(newText);n++;
}
rep("h('strong', null, verified && power.baseBonus > 0 ? '+' + percent(power.baseBonus) : '0%')",
    "h('strong', null, verified ? (power.baseBonus > 0 ? '+' + percent(power.baseBonus) : '0%') : '待核实')");
rep("specialty && h('p', { className: 'fantasy-coach-specialty' }, '擅长：' + specialty));",
    "specialty && h('p', { className: 'fantasy-coach-specialty' }, '擅长：' + specialty), !verified && h('p', { className: 'fantasy-coach-specialty' }, '新帅或上季执教记录待核实，暂不计基础战力'));");
rep("else if(['signPlayer','signCoach'].includes(action.type)){\r\n          if(next.pendingMatch)throw new Error('请先完成当前比赛');",
    "else if(['signPlayer','signCoach'].includes(action.type)){\r\n          if(next.pendingMatch)throw new Error('比赛进行中不能'+(action.type==='signCoach'?'签约教练':'签约球员')+'，请先完成当前比赛');");
rep("}else if(['sellPlayer','sellCoach'].includes(action.type)){\r\n          if(next.pendingMatch)throw new Error('请先完成当前比赛');",
    "}else if(['sellPlayer','sellCoach'].includes(action.type)){\r\n          if(next.pendingMatch)throw new Error('比赛进行中不能'+(action.type==='sellCoach'?'出售教练':'出售球员')+'，请先完成当前比赛');");
fs.writeFileSync(p,s,"utf8");
console.log("replacements",n,"bytes",fs.statSync(p).size);
