// 启动优化：去掉首屏图片预载抢占带宽；进度条改纯绿 + 等待流光
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

// 1) index.html 内联启动样式
let html = fs.readFileSync(root + "index.html", "utf8");
const oldFill = ".cba-boot-progress-fill{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#64748b,#a3e635);box-shadow:0 0 12px #a3e63566;transition:width .18s ease-out}";
const newFill = ".cba-boot-progress-fill{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#83bb1b,#a3e635 55%,#c4f06a);background-size:220% 100%;box-shadow:0 0 14px #a3e63580;transition:width .18s ease-out}\n.cba-boot-progress-fill.cba-boot-shimmer{animation:cba-boot-flow 1.15s linear infinite}\n@keyframes cba-boot-flow{from{background-position:0% 0}to{background-position:-220% 0}}";
if (!html.includes(oldFill)) { console.log("✗ 未找到启动进度条样式"); process.exit(1); }
html = html.replace(oldFill, newFill);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("✓ 启动进度条改绿色");

// 2) cba-launch.js：取消图片预载、脚本高优先级、等待时流光
let js = fs.readFileSync(root + "cba-launch.js", "utf8");
const oldImages = `    const imageList=document.getElementById('cba-boot-images');
    for(const url of imageList?JSON.parse(imageList.textContent):[]){
      if(hinted.has(url))continue;hinted.add(url);
      const hint=document.createElement('link');hint.rel='preload';hint.as='image';hint.href=url;hint.fetchPriority='low';document.head.appendChild(hint);
    }
`;
if (!js.includes(oldImages)) { console.log("✗ 未找到图片预载代码"); process.exit(1); }
js = js.replace(oldImages, `    // 首屏大图不预载：它们会在主界面渲染时按需加载，避免和游戏 bundle 抢带宽。
`);
js = js.replace("const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;", "const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;hint.fetchPriority='high';");
js = js.replace("fill.style.width=value+'%';percent.textContent=value+'%';progress.setAttribute('aria-valuenow',String(value));\n    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在进入主界面';",
  "fill.style.width=value+'%';percent.textContent=value+'%';progress.setAttribute('aria-valuenow',String(value));\n    fill.classList.toggle('cba-boot-shimmer',!done&&value>=90);\n    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在加载球队数据';");
fs.writeFileSync(root + "cba-launch.js", js, "utf8");
try { new Function(js); console.log("✓ cba-launch.js 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }