// cloud-config-remove.js — 移除原版云服务配置域名 + 核查 hupu 域名用途
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

// 1. CBA_CLOUD_CONFIG 默认值置空（云模块会在 NOT_CONFIGURED 处安全失败，不再指向第三方域名）
const OLD = 'window.CBA_CLOUD_CONFIG=window.CBA_CLOUD_CONFIG||{envId:"app-1b8c1d4749-d8gmk54gz5fc75d0d",apiBase:"https://app-1b8c1d4749-d8gmk54gz5fc75d0d-1252166086.ap-shanghai.app.tcloudbase.com/api"};';
const NEW = 'window.CBA_CLOUD_CONFIG=window.CBA_CLOUD_CONFIG||{};';
if (js.indexOf(OLD) >= 0) {
  js = js.split(OLD).join(NEW);
  console.log("✓ CBA_CLOUD_CONFIG 已置空（移除 tcloudbase 域名）");
} else {
  console.log("✗ 未找到 CBA_CLOUD_CONFIG 锚点");
  const i = js.indexOf("CBA_CLOUD_CONFIG=");
  console.log(js.slice(i, i + 200));
  process.exit(1);
}
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ " + e.message); process.exit(1); }

// 2. hupu 域名出现位置（确认是否为请求目标）
for (const host of ["bbs.hupu.com", "activity-static.hupu.com", "cba.hupu.com", "nba.hupu.com", "i11.hoopchina.com.cn"]) {
  let i = js.indexOf(host), n = 0;
  console.log("\n== " + host + " x" + (js.split(host).length - 1) + " ==");
  while (i >= 0 && n < 2) {
    const ctx = js.slice(Math.max(0, i - 140), i + 100).replace(/\s+/g, " ");
    if (!/sourceUrl|hupuId|avatarSource|dataSource/.test(ctx)) {
      console.log("⚠ 非数据字段上下文: " + ctx.slice(0, 260));
      n++;
    }
    i = js.indexOf(host, i + 1);
  }
}