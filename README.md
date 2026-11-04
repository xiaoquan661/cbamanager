# CBA梦幻经理 — 源码备份

## 游戏信息

| 项目 | 内容 |
| --- | --- |
| 游戏名称 | CBA梦幻经理 |
| 平台 | 虎扑 AI 工坊（aiworks.hupu.com） |
| activityId | app_abeee24239 |
| 线上版本 | v6 |
| 分类 | 阵容组建 |
| 热度 | 12W+ |
| 游戏简介 | 签约巨星，运筹阵容！打造属于你的CBA梦幻阵容 |
| 原始地址 | https://activity-static.hupu.com/shaper/published/app_abeee24239/index.html |
| 工坊详情页 | https://aiworks.hupu.com/game-detail?id=app_abeee24239 |

## 文件结构

```text
CBA梦幻经理/
  index.html                          外壳页（负责加载 iframe、平台对接）
  __ai_app.html                       游戏入口页（启动器 + 资源清单 manifest）
  cba-app-gate.js                     虎扑 App 环境门槛校验（入口 gate）
  cba-launch.js                       启动器（按 manifest 顺序加载资源、渲染进度条）
  cba-startup.css                     游戏主样式（434KB）
  cba-startup.js                      游戏主逻辑 bundle（3.6MB）
  README.md                           本说明
  assets/
    home-fast/                        首屏图片（15 张 webp/jpg/svg）
    avatars-r12/                      20 支球队球员头像分片（93 个 JS 文件）
    avatar-unavailable.svg / fogg-user-20261015.png / yang-tengfei-20261015.webp
  assets/(平台依赖备份)
    hupu-js-bridge_v1.1.8.js           虎扑 JS Bridge
    web-guard-2.0.27-index.min.js      虎扑防护脚本
    colorbox-ai_v2.2.18.js             虎扑 ColorboxAI SDK
    colyseus-0.18.2.js                 Colyseus 实时通信 SDK
    hupu-Medium.ttf / hupu-Regular.ttf 虎扑字体
```

## 本地化修改（2026-10-19）

为本地离线游玩做了两处修改，原始文件备份在 `C:\10.19源码\_原始备份\CBA梦幻经理__ai_app.html`：

1. `__ai_app.html` 的 `<html>` 标签加了 `data-r13-practice="true"`——这是游戏开发者自己内置的**本地试玩模式**开关（`CBA_RELEASE_CONFIG.practiceMode`）：
   - 入口门槛（虎扑 App 环境校验）直接旁路，不再停在「确认游戏入口」页
   - 云端请求全部改走游戏内置的 `CBAR13Practice` 本地独立存档，不依赖虎扑登录
   - 界面显示「本地试玩 · 独立存档」角标（游戏自带的设计）
2. `__ai_app.html` 在 ColorboxAI SDK 之后注入了「访客身份垫片」：`getUserInfo` 返回明确的未登录响应，避免身份模块每 10 秒超时重试、顶部反复显示「用户信息读取失败，请点击重试」。

已实测验证：门槛页不再出现，游戏直接进入主界面（球队、市场、每日预测、排行榜等全部可用），存档走本地独立通道。

## 本地运行

双击 `index.html` 打开即可直接游玩（已实测）。注意：本地为试玩模式，与虎扑线上的正式存档相互独立；顶部「请先在虎扑 App 登录」是稳定的访客状态提示，不影响游玩。

## 架构说明

- 外壳 index.html → iframe 加载 `__ai_app.html`（启动器）→ 按 manifest 顺序加载 `cba-startup.css/js` → 主逻辑再按需加载 `assets/` 下的头像分片与图片。
- 头像采用分片 JS 按需加载（team-XX-part-XX-hash.js），共 93 片，对应 20 支球队。
- 云端存档走虎扑 tcloudbase（腾讯云开发）接口 `api/game/save`，入口校验服务器权威。
- 存档、身份都绑定虎扑账号体系；迁移到其他平台（如 Lamps）时需要把 gate 校验和云端存档改造成目标平台 API（`saveGameProgress` 等）。
- 抓取时间：2026-10-19。
