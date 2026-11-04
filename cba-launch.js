(function () {
  'use strict';
  const manifest=JSON.parse(document.getElementById('cba-launch-resources').textContent);
  const root=document.getElementById('root');
  const gatePanel=document.getElementById('cba-entry-gate');
  const errorPanel=document.getElementById('cba-boot-error');
  const loading=document.getElementById('cba-boot-loading');
  const progress=document.getElementById('cba-boot-progress');
  const fill=document.getElementById('cba-boot-progress-fill');
  const percent=document.getElementById('cba-boot-percent');
  const label=document.getElementById('cba-boot-status');
  const complete=new Set(),pending=new Map(),hinted=new Set();
  const total=manifest.reduce((sum,item)=>sum+Math.max(1,Number(item.bytes)||1),0);
  let running=false,entered=false,reloadNeeded=false,entryAllowed=false;
  function updateProgress(done=false) {
    const bytes=manifest.filter(item=>complete.has(item.url)).reduce((sum,item)=>sum+Math.max(1,Number(item.bytes)||1),0);
    const value=done?100:Math.min(95,Math.floor(90*bytes/total)+(entryAllowed?5:0));
    fill.style.width=value+'%';percent.textContent=value+'%';progress.setAttribute('aria-valuenow',String(value));
    fill.classList.toggle('cba-boot-shimmer',!done&&value>=90);
    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在加载球队数据';
  }
  function load(item) {
    if(complete.has(item.url))return Promise.resolve();
    if(pending.has(item.url))return pending.get(item.url);
    const work=new Promise((resolve,reject)=>{
      const element=document.createElement(item.type==='style'?'link':'script');
      if(item.type==='style'){element.rel='stylesheet';element.href=item.url;}
      else {element.src=item.url;element.async=false;}
      element.onload=()=>{complete.add(item.url);updateProgress();resolve();};
      element.onerror=()=>{element.remove();reject(new Error('游戏资源暂时无法打开，请检查网络后重试。'));};
      document.head.appendChild(element);
    }).finally(()=>pending.delete(item.url));
    pending.set(item.url,work);return work;
  }
  function preloadScripts() {
    // 首屏大图不预载：它们会在主界面渲染时按需加载，避免和游戏 bundle 抢带宽。
    for(const item of manifest.filter(item=>item.type!=='style')){
      if(hinted.has(item.url))continue;
      hinted.add(item.url);
      const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;hint.fetchPriority='high';
      document.head.appendChild(hint);
    }
  }
  function waitForGame() {
    return new Promise((resolve,reject)=>{
      if(root.firstElementChild)return resolve();
      const observer=new MutationObserver(()=>{if(root.firstElementChild){observer.disconnect();clearTimeout(timer);resolve();}});
      const timer=setTimeout(()=>{observer.disconnect();reloadNeeded=true;reject(new Error('游戏暂时无法打开，请重新连接；已有云端进度会保留。'));},45000);
      observer.observe(root,{childList:true});
    });
  }
  function retryButton(text,node) {
    const button=document.createElement('button');button.type='button';button.textContent=text;button.className='cba-boot-retry';
    button.addEventListener('click',()=>{if(reloadNeeded)window.location.reload();else start();});node.appendChild(button);
  }
  async function start() {
    if(running||entered)return;
    running=true;gatePanel.hidden=true;errorPanel.hidden=true;loading.hidden=false;updateProgress();
    try {
      // The inline spinner is visible while resources and identity initialize.
      // Progress tracks completed resources, never an artificial timer.
      preloadScripts();
      const practice=document.documentElement.dataset.r13Practice==='true';
      const accessWork=practice?Promise.resolve({allowed:true}):Promise.resolve().then(()=>{
        if(typeof window.CBAAppGate?.check!=='function')throw new Error('入口服务暂未连接，请重试。');
        return window.CBAAppGate.check();
      });
      const [access]=await Promise.all([accessWork,Promise.all(manifest.filter(item=>item.type==='style').map(load))]);
      if(!access?.allowed){loading.hidden=true;window.CBAAppGate.render(gatePanel);gatePanel.hidden=false;retryButton('重新检查',gatePanel);return;}
      entryAllowed=true;updateProgress();
      // Preloaded scripts execute in their declared dependency order.
      for(const item of manifest.filter(item=>item.type!=='style'))await load(item);
      // Finish only when the real game has mounted; do not prolong startup for
      // a decorative animation or wait for every optional sprite to decode.
      await waitForGame();entered=true;updateProgress(true);loading.hidden=true;
      window.dispatchEvent(new CustomEvent('cba:game-entered'));
    } catch(error) {
      loading.hidden=true;
      errorPanel.replaceChildren();
      const message=document.createElement('p');message.textContent=error.message||'游戏暂时无法打开，请重试。';errorPanel.appendChild(message);
      retryButton(reloadNeeded?'重新打开':'重试',errorPanel);errorPanel.hidden=false;
    } finally {running=false;}
  }
  start();
}());
