# 签下整个CBA

一款以 CBA 球员与教练为题材的范特西篮球小游戏：签约球员、组建五人首发、安排战术、参加赛季征战，并用每日行情和球探推荐经营自己的球队。

## 游戏特色

- **真实球员与教练资料**：内置 CBA 球员、教练、球队与赛季赛程数据，能力、合同类型、外援身份和身价随官方赛果更新。
- **球探中心**：每日 5 张球探推荐卡，全部享受 6–8 折签约价；折扣只用一次，卖出后该卡显示「优惠已使用」。
- **签约市场**：球员签约、教练签约、我的签约三个分区；支持能力、涨跌幅、价格排序，以及球队筛选。
- **球队管理**：五人首发、替补席、战术调整、系统推荐首发；球队最多签约 12 名球员。
- **每日任务与签到**：每日任务、签到、周活跃奖励；任务完成后可直接领取，红点会随领取状态即时更新。
- **每日预测**：竞猜当日比赛结果，按预测结果结算奖励。
- **征战之路**：26 场常规赛，季后赛与总决赛，赛季结算发放冠军/未夺冠奖励。
- **排行榜**：基于 Lamps 平台排行榜的战力榜、价值榜、预测榜。
- **激励视频**：金币补给、球探推荐刷新、招募卡补给等场景接入平台激励视频。

## 技术栈

- React 18（构建后的 `cba-startup.js` 单文件 bundle）
- 原生 CSS（`cba-startup.css`）
- 原生 JavaScript DOM 模块（`assets/lamps/`，负责平台桥接、每日任务、排行榜面板、数据同步）
- Lamps 小游戏平台能力：进度存档、排行榜、激励视频、平台请求

## 目录结构

```text
签下整个CBA/
├─ index.html                 游戏入口与资源清单
├─ cba-launch.js              启动器：预加载资源与游戏 bundle
├─ cba-startup.css            游戏主样式
├─ cba-startup.js             游戏主逻辑与数据 bundle
├─ player-feed.json           官方赛果/球员数据快照
├─ assets/
│  ├─ lamps/                  Lamps 平台桥接模块
│  │  ├─ cba-lamps-glue.js    平台入口、商店刷新、排行榜面板、行情同步
│  │  ├─ cba-daily-tasks.js   每日任务与周活跃
│  │  ├─ cba-rank-sync.js     排行榜成绩上报
│  │  ├─ request-*.js         平台请求通道
│  │  ├─ game-progress-*.js   平台进度存档
│  │  ├─ game-leaderboard-*.js 平台排行榜
│  │  └─ game-rewarded-video-*.js 激励视频
│  ├─ avatars-r12/            球员头像分片
│  ├─ sprites/                图片精灵 Atlas
│  ├─ teams/                  球队队徽
│  ├─ home-fast/              首页图片
│  └─ lobby/                  大厅图片
├─ recon/                     构建、校验、上传与数据同步脚本
├─ relay/                     官方赛果数据管线与云函数参考实现
└─ docs/                      设计与数据说明
```

## 本地运行

```bash
bun recon/serve.js
```

打开 `http://localhost:8791/`。

本地预览没有 Lamps SDK 环境，因此：

- 排行榜、激励视频、云端账号相关能力不可用或返回空数据；
- 游戏按独立存档模式运行，适合调试 UI、阵容、签约和本地经济逻辑。

## 存档说明

当前发布入口启用了独立存档模式：

```html
<html lang="zh-CN" data-r13-practice="true">
```

这意味着进度保存在本机独立存储中，不会自动同步到其他设备。代码中保留了 Lamps 云存档桥接模块（`game-progress-*.js`），但当前版本没有启用云端存档；如需跨设备同步，需要切换到云存档会话并验证平台存档读写。

## 构建与发布

1. 修改版本号（`recon/bump-daily-ui.js` 中的 `VER`，同时更新资源缓存参数）。
2. 将入口文件、样式、bundle、平台脚本和资源复制到 `dist/stage/`。
3. 生成上传包：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File recon/make-zip.ps1
```

4. 校验上传包：

```bash
bun recon/verify-no-pvp-zip.js
```

5. 上传 Lamps（需要本地 `.lamps/auth-key`，且必须得到明确授权）：

```bash
bun recon/lamps-upload-update.js
```

`auth-key` 只从本地文件读取，不会写入仓库或游戏代码。

## 数据与行情

- `player-feed.json` 是随包发布的官方赛果快照，包含球员、赛程、球队和历史数据。
- 运行时通过 Lamps 平台请求通道同步官方行情；平台代理不可用时保留最近一次成功数据，并在界面上显示「已保留最近数据」。
- 市场身价由官方赛果和能力模型计算，卖出按当前市场价的 90% 回收。
- 球探推荐每日 5 张，全部为 6–8 折；同一张推荐卡的折扣只可使用一次。

## 合规与安全

- 业务请求统一通过 `window.LampsGame.request`，不使用 `fetch` / `XMLHttpRequest` 直连。
- 排行榜使用 `window.LampsPlatform` 能力，`dataLoad` 仅包含昵称和预测成功次数，不上传阵容或个人信息。
- 激励视频只在平台回调成功（`ok === true`）后发奖。
- 仓库不包含 auth key、平台会话、构建产物或用户存档。

## 开发脚本

| 脚本 | 用途 |
| --- | --- |
| `recon/serve.js` | 本地静态预览服务 |
| `recon/make-zip.ps1` | 生成 Lamps 上传 ZIP |
| `recon/verify-no-pvp-zip.js` | 上传包资源与域名/网络检查 |
| `recon/lamps-upload-update.js` | 上传到 Lamps 开放平台 |
| `recon/embed-feed.js` | 将最新 `player-feed.json` 注入 bundle |
| `recon/bump-daily-ui.js` | 更新版本号与缓存参数 |

## 说明

本项目为独立的 CBA 范特西篮球小游戏实现。CBA 相关球队名称、球员资料与标识归相关权利人所有，仅用于游戏展示与数据演示。
