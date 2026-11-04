// 把「临场状态」的实际效果写清楚：角标带百分比、详情页面板、市场页图例
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

/* ---------- 1. bundle：更新注释 + describe 带效果 ---------- */
const bundlePath = root + "cba-startup.js";
let js = fs.readFileSync(bundlePath, "utf8");

const oldComment = ` *   火热 hot  ：近 3 场范特西得分 ≥ 赛季场均 ×1.2 → 临场能力 +5%
 *   冰凉 cold ：近 3 场范特西得分 ≤ 赛季场均 ×0.8 → 临场能力 −5%
 *   轮休 rested：上一场出战但 min < 15 → 仅标记（PVE 上场惩罚后续接入）
 *   伤停 injured：最近 2 场球队比赛连续未出战 → 仅标记（首发限制后续接入）`;
const newComment = ` *   火热 hot  ：近 3 场范特西得分 ≥ 赛季场均 ×1.2 → 临场能力 +5%
 *   冰凉 cold ：近 3 场范特西得分 ≤ 赛季场均 ×0.8 → 临场能力 −5%
 *   轮休 rested：上一场出战但 min < 15 → 临场能力 −8%
 *   伤停 injured：最近 2 场球队比赛连续未出战 → 禁止进入首发`;
if (js.includes(oldComment)) js = js.replace(oldComment, newComment);
else console.log("WARN 注释未匹配");

const oldDescribe = `  function describe(playerId){
    var s=status(playerId);
    return s.label||'状态正常';
  }`;
const newDescribe = `  function describe(playerId){
    var s=status(playerId);
    if(!s||!s.label) return '状态正常';
    if(s.kind==='injured') return s.label+'（禁止首发）';
    if(s.delta) return s.label+'（能力'+(s.delta>0?'+':'')+Math.round(s.delta*100)+'%）';
    return s.label;
  }`;
if (js.includes(oldDescribe)) js = js.replace(oldDescribe, newDescribe);
else console.log("WARN describe 未匹配");
fs.writeFileSync(bundlePath, js, "utf8");
console.log("bundle bytes", fs.statSync(bundlePath).size);

/* ---------- 2. glue：角标带效果 + 市场图例 + 详情页面板 ---------- */
const gluePath = root + "assets/lamps/cba-lamps-glue.js";
let glue = fs.readFileSync(gluePath, "utf8");

const oldLabel = `    var FORM_LABEL = { hot: '🔥火热', cold: '🧊冰凉', injured: '🏥伤停', rested: '😴轮休' };`;
const newLabel = `    var FORM_INFO = {
      hot: { badge: '🔥火热 +5%', effect: '临场能力 +5%', desc: '近 3 场范特西得分 ≥ 赛季平均值 ×1.2' },
      cold: { badge: '🧊冰凉 -5%', effect: '临场能力 -5%', desc: '近 3 场范特西得分 ≤ 赛季平均值 ×0.8' },
      rested: { badge: '😴轮休 -8%', effect: '临场能力 -8%', desc: '上一场出战不足 15 分钟' },
      injured: { badge: '🏥伤停 禁止首发', effect: '不能进入首发', desc: '最近 2 场球队比赛连续未出战' }
    };
    var FORM_ORDER = ['hot', 'cold', 'rested', 'injured'];
    function formStatusByName(name) {
      if (!nameMap) refreshNameMap();
      var info = nameMap[name];
      if (!info) return { kind: 'normal', label: '正常', effect: '无能力增减', desc: '近 3 场表现稳定或样本不足' };
      var meta = FORM_INFO[info.kind] || {};
      return { kind: info.kind, label: info.label, effect: meta.effect || '', desc: meta.desc || '' };
    }`;
if (glue.includes(oldLabel)) glue = glue.replace(oldLabel, newLabel);
else console.log("WARN FORM_LABEL 未匹配");

const oldBadge = `        if (!info || !FORM_LABEL[info.kind]) continue;
        var badge = doc.createElement('span');
        badge.className = 'cba-form-badge cba-form-' + info.kind;
        badge.textContent = FORM_LABEL[info.kind];
        person.appendChild(badge);`;
const newBadge = `        if (!info || !FORM_INFO[info.kind]) continue;
        var meta = FORM_INFO[info.kind];
        var badge = doc.createElement('span');
        badge.className = 'cba-form-badge cba-form-' + info.kind;
        badge.textContent = meta.badge;
        badge.title = meta.desc + '，' + meta.effect;
        badge.setAttribute('aria-label', info.label + '，' + meta.effect);
        person.appendChild(badge);`;
if (glue.includes(oldBadge)) glue = glue.replace(oldBadge, newBadge);
else console.log("WARN 市场角标未匹配");

const oldBadge2 = `        if (!info2 || !FORM_LABEL[info2.kind]) continue;
        var badge2 = doc.createElement('span');
        badge2.className = 'cba-form-badge cba-form-' + info2.kind;
        badge2.textContent = FORM_LABEL[info2.kind];
        sName.appendChild(badge2);`;
const newBadge2 = `        if (!info2 || !FORM_INFO[info2.kind]) continue;
        var meta2 = FORM_INFO[info2.kind];
        var badge2 = doc.createElement('span');
        badge2.className = 'cba-form-badge cba-form-' + info2.kind;
        badge2.textContent = meta2.badge;
        badge2.title = meta2.desc + '，' + meta2.effect;
        badge2.setAttribute('aria-label', info2.label + '，' + meta2.effect);
        sName.appendChild(badge2);`;
if (glue.includes(oldBadge2)) glue = glue.replace(oldBadge2, newBadge2);
else console.log("WARN 表现榜角标未匹配");

// 在 decorate 末尾追加：市场图例 + 球员详情面板
const oldTail = `        sName.appendChild(badge2);
      }
    }`;
const newTail = `        sName.appendChild(badge2);
      }
      // 市场页：状态效果图例（静态 DOM，React 重渲染后补挂）
      var market = doc.querySelector('section.fantasy-market');
      if (market && !market.querySelector('[data-cba-form-legend]')) {
        var caption = market.querySelector('.fantasy-market-caption');
        if (caption) {
          var legend = doc.createElement('div');
          legend.className = 'cba-form-legend';
          legend.setAttribute('data-cba-form-legend', '1');
          var lead = doc.createElement('b');
          lead.textContent = '临场状态';
          legend.appendChild(lead);
          for (var oi = 0; oi < FORM_ORDER.length; oi++) {
            var ok = FORM_ORDER[oi];
            var item = doc.createElement('span');
            item.className = 'cba-form-legend-item cba-form-' + ok;
            item.textContent = FORM_INFO[ok].badge + ' · ' + FORM_INFO[ok].effect;
            item.title = FORM_INFO[ok].desc;
            legend.appendChild(item);
          }
          caption.parentNode.insertBefore(legend, caption.nextSibling);
        }
      }
      // 球员详情页：临场状态面板
      var screen = doc.querySelector('.fantasy-player-screen');
      if (screen && !screen.querySelector('[data-cba-form-panel]')) {
        var pdName = screen.querySelector('.pd-name h2');
        var tabs = screen.querySelector('.pd-tabs');
        if (pdName && tabs) {
          var st = formStatusByName(pdName.textContent.trim());
          var panel = doc.createElement('div');
          panel.className = 'cba-form-panel cba-form-' + st.kind;
          panel.setAttribute('data-cba-form-panel', '1');
          var head = doc.createElement('div');
          var strong = doc.createElement('b');
          strong.textContent = '临场状态 · ' + (st.label || '正常');
          var eff = doc.createElement('span');
          eff.textContent = st.effect || '无能力增减';
          head.appendChild(strong);
          head.appendChild(eff);
          var note = doc.createElement('small');
          note.textContent = (st.desc || '') + ' · 每日按真实比赛数据更新';
          panel.appendChild(head);
          panel.appendChild(note);
          screen.insertBefore(panel, tabs);
        }
      }
    }`;
if (glue.includes(oldTail)) glue = glue.replace(oldTail, newTail);
else console.log("WARN decorate 末尾未匹配");

// 扩展注入样式
const oldCss = `      '.cba-form-rested{background:#263244;color:#f8fafc;border:1px solid #64748b;}',
    ].join('');`;
const newCss = `      '.cba-form-rested{background:#263244;color:#f8fafc;border:1px solid #64748b;}',
      '.cba-form-legend{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin:8px 0 10px;padding:8px 10px;border-radius:10px;background:#111827;border:1px solid #263244;font-size:10px;line-height:1.6;color:#94a3b8;}',
      '.cba-form-legend>b{color:#f8fafc;font-size:10px;margin-right:2px;}',
      '.cba-form-legend-item{white-space:nowrap;}',
      '.cba-form-panel{margin:10px 14px 0;padding:9px 12px;border-radius:12px;background:#111827;border:1px solid #263244;}',
      '.cba-form-panel>div{display:flex;align-items:center;justify-content:space-between;gap:8px;}',
      '.cba-form-panel b{font-size:12px;color:#f8fafc;}',
      '.cba-form-panel span{font-size:12px;font-weight:800;color:#a3e635;}',
      '.cba-form-panel small{display:block;margin-top:3px;font-size:10px;color:#94a3b8;}',
      '.cba-form-panel.cba-form-rested span,.cba-form-panel.cba-form-cold span{color:#38bdf8;}',
      '.cba-form-panel.cba-form-injured span{color:#f87171;}',
      '.cba-form-panel.cba-form-normal span{color:#94a3b8;}',
    ].join('');`;
if (glue.includes(oldCss)) glue = glue.replace(oldCss, newCss);
else console.log("WARN 样式块未匹配");

fs.writeFileSync(gluePath, glue, "utf8");
console.log("glue bytes", fs.statSync(gluePath).size, "hasFormInfo", glue.includes("FORM_INFO"));
