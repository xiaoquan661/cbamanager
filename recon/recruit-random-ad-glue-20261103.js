const fs=require("fs");const p="assets/lamps/cba-lamps-glue.js";let s=fs.readFileSync(p,"utf8");
function rep(a,b,expect=1){const c=s.split(a).length-1;if(c!==expect){console.error("MATCH",c,a.slice(0,90));process.exit(1);}s=s.split(a).join(b);}
rep("var desc = doc.createElement('p'); desc.textContent = '使用后随机招募 1 名球员 · 1 张抵 1 次';",
    "var desc = doc.createElement('p'); desc.textContent = '看上方「看广告，随机领卡」补给 · 使用后随机招募 1 名球员';");
rep("      var ad = doc.createElement('button'); ad.type = 'button'; ad.className = 'fantasy-button subtle cba-recruit-ad'; ad.textContent = '看广告 +1'; ad.setAttribute('data-recruit-ad', '1');\n","");
const adHandlerStart=s.indexOf("      ad.addEventListener('click', function () {", s.indexOf("function build(grid)"));
const adHandlerEnd=s.indexOf("      actions.appendChild(use); actions.appendChild(ad);", adHandlerStart);
if(adHandlerStart<0||adHandlerEnd<0){console.error('handler bounds');process.exit(1);}
s=s.slice(0,adHandlerStart)+s.slice(adHandlerEnd);
rep("      actions.appendChild(use); actions.appendChild(ad);","      actions.appendChild(use);");
rep("      var ad = card.querySelector('[data-recruit-ad]');\n","");
rep("      if (ad) { ad.disabled = busy; ad.textContent = busy ? '播放中…' : '看广告 +1'; }\n","");
// insert capture click handler before MutationObserver
const marker="    var pending = null;\n    new MutationObserver(function () {";
const handler=`    function randomAdButton(node) {
      while (node && node !== doc) {
        if (node.tagName === 'BUTTON' && String(node.textContent || '').indexOf('看广告，随机领卡') >= 0) return node;
        node = node.parentNode;
      }
      return null;
    }
    doc.addEventListener('click', function (event) {
      var btn = randomAdButton(event.target);
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      if (busy) return;
      busy = true;
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = '正在播放…';
      var play = (inLamps && typeof lampsGame.showRewardedVideo === 'function')
        ? lampsGame.showRewardedVideo({ source: 'random-item' })
        : Promise.resolve({ ok: true });
      play.then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.message) || '观看视频失败，请重试');
        if (!global.CBAStorageSession || typeof global.CBAStorageSession.dispatch !== 'function') throw new Error('存档尚未就绪');
        if (!global.CBAStorageSession.dispatch({ type: 'randomAdReward' })) throw new Error('奖励发放失败');
        toast('随机道具已到账');
      }).catch(function (err) {
        toast((err && err.message) || '观看视频失败，请重试');
      }).then(function () {
        busy = false;
        if (btn.isConnected) { btn.disabled = false; btn.textContent = original; }
        render();
      });
    }, true);

`+marker;
rep(marker,handler);
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
