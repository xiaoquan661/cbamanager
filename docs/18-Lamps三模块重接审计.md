# 18 Lamps 三模块重接审计（广告/云存档/云排行榜）

> 日期：2026-10-30。按 skill 规范逐条审计现有接入，补齐排行榜缺口。实测通过。

## 一、审计结果与修复

| 模块 | 规范符合度 | 本轮动作 |
|---|---|---|
| 云端存档（progress） | ✅ 完全合规 | 无需改动——game_payload 包装、boot 读 record.gamePayload、有限推送、bridge/platform 顺序正确 |
| 广告（rewarded video） | ✅ 完全合规 | 无需改动——source 场景名、只认 res.ok、180s 超时、不传 gameId、无并发激励流程 |
| 云排行榜（leaderboard） | ❌ 未接入 | **新增 `cba-rank-sync.js`** |

## 二、排行榜接入设计（cba-rank-sync.js）

- **双榜**：战力榜 `gameRankType:"power"` + 价值榜 `"value"`（固定稳定字符串）
- **计分**：从游戏状态实时推导——首发 5 人（CBAPlayerData.getCardRating 战力）+ 全队现价合计（CBAFantasyData.playerQuote 价值）
- **dataLoad**：`{nickname, lineup:[5×playerId], names}`——**同时是 P2 异步 PVP 的对手池来源**（squad-share 优先从 power 榜拉阵容，云函数池降级）
- **提交时机**：boot 数据就绪后 + 每 10 分钟检查（30 分钟节流窗）+ `cba:data-date-changed` 事件（数据更新后）
- **读取**：暴露 `CBARankSync.readBoard(type)`（榜单 UI 恢复时直接用）
- **本地静默**：UA 无 LampsSDK 时提交优雅返回 ok:false"排行榜暂不可用"、读取空列表——不报错不阻塞

## 三、验证（2026-10-30 本地）

- ✅ CBARankSync 加载（rank-r29-20261029）
- ✅ LampsPlatform submit/get 方法就位
- ✅ 本地 readBoard 空、submit 优雅拒绝（符合 skill"UA 不含 LampsSDK"约束）
- ✅ 控制台 0 错误
- ✅ 顺便验证：金币 1,220 持久（昨日签到 +220 经云存档镜像存续）
- ⏳ Lamps 真机提交/读榜：待上传后验证

## 四、P2 升级说明

对手池数据源升级为双源：**Lamps 战力榜 dataLoad（首选，Lamps 原生持久）→ 云函数内存池（降级）→ 官方模拟阵容（兜底）**。排行榜接入让 P2 不再依赖云函数池的持久化短板。

## 五、挂载清单（index.html 最终顺序）

```html
<script defer src="assets/lamps/request-bridge.js"></script>
<script defer src="assets/lamps/request-platform.js"></script>
<script defer src="assets/lamps/game-progress-bridge.js"></script>
<script defer src="assets/lamps/game-progress-platform.js"></script>
<script defer src="assets/lamps/game-leaderboard-bridge.js"></script>
<script defer src="assets/lamps/game-leaderboard-platform.js"></script>
<script defer src="assets/lamps/game-rewarded-video-bridge.js"></script>
<script defer src="assets/lamps/game-rewarded-video-platform.js"></script>
<script defer src="assets/lamps/cba-daily-tasks.js?v=5"></script>
<script defer src="assets/lamps/cba-rank-sync.js?v=1"></script>
<script defer src="assets/lamps/cba-squad-share-r29.js?v=2"></script>
<script defer src="assets/lamps/cba-lamps-glue.js?v=20261029h-rank"></script>
<script defer src="cba-launch.js?v=20261019-r27-37-checkin-once"></script>
```
