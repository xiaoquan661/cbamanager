// fix-arena-stats.js — 征战球场卡片补充 篮板/助攻/抢断/盖帽 实时数据
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

// 1) 得分表之后追加：从事件流聚合每人 板/助/断/帽
const OLD_MAP = "oe=new Map;for(let t of e.events.slice(0,c+1)){let e=t.side+`:`+t.playerId;oe.set(e,(oe.get(e)||0)+t.points)}";
const NEW_MAP = OLD_MAP +
  "let st=new Map,push=(k,f)=>{let v=st.get(k)||{r:0,a:0,l:0,b:0};f(v);st.set(k,v)};for(let t of e.events.slice(0,c+1)){let opp=t.side===`home`?`away`:`home`;if(t.assistId)push(t.side+`:`+t.assistId,v=>v.a++);if(t.reboundId)push((t.reboundSide||t.side)+`:`+t.reboundId,v=>v.r++);if(t.stealId)push(opp+`:`+t.stealId,v=>v.l++);if(t.blockId)push(opp+`:`+t.blockId,v=>v.b++)}";

// 2) 卡片得分行追加统计
const OLD_EM = "(0,D.jsxs)(`em`,{children:[oe.get(t+`:`+e.id)||0,` 分`]})";
const NEW_EM = "(0,D.jsxs)(`em`,{children:[oe.get(t+`:`+e.id)||0,` 分`,(()=>{let v=st.get(t+`:`+e.id);if(!v)return``;let a=[];if(v.r)a.push(v.r+`板`);if(v.a)a.push(v.a+`助`);if(v.l)a.push(v.l+`断`);if(v.b)a.push(v.b+`帽`);return a.length?` `+a.join(` `):``})()]})";

let ok = 0;
if (js.indexOf(OLD_MAP) >= 0) { js = js.split(OLD_MAP).join(NEW_MAP); ok++; console.log("✓ 统计聚合已注入"); }
else console.log("✗ 未找到得分表锚点");
if (js.indexOf(OLD_EM) >= 0) { js = js.split(OLD_EM).join(NEW_EM); ok++; console.log("✓ 卡片统计行已注入"); }
else console.log("✗ 未找到卡片渲染锚点");
if (ok !== 2) process.exit(1);

fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

// 版本同步
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030f-arena-stats';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030f-arena-stats");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → 20261030f-arena-stats");
