# 15 异步 PVP 记录（P2，方案 A：云函数阵容池）

> 日期：2026-10-29。代码全部就绪，**待用户重新部署云函数后生效**。

## 一、设计

```
玩家阵容（5 首发）→ POST /cba/lineup → 云函数内存池（200 条 FIFO）
其他玩家打开游戏 → GET /cba/lineups?count=19 → 随机对手池
  ↓
引擎选对手钩子（I_ 函数开头）：window.__CBA_PVPSYNC__.pool20(P_)
  → 用玩家阵容替换官方 20 队中的前 N 个 → 征战之路打真实玩家阵容
降级链：云函数池 → Lamps 榜 dataLoad（预留）→ 官方 20 队模拟阵容
```

## 二、交付物

| 文件 | 内容 |
|---|---|
| 引擎补丁 | `I_` 函数开头加 PVP 池钩子（`window.__CBA_PVPSYNC__.pool20(P_)`，池就绪且长度 20 才替换） |
| `assets/lamps/cba-squad-share-r29.js` | 阵容快照生成（5 首发→官方ID/名/位置）、上报（阵容变化才报，10 分钟间隔）、拉池（19 人随机）、pool20 注入（team 名唯一化"昵称 的球队"） |
| `relay/scf/index.web.js` | 云函数新增 `POST /cba/lineup`（上报，5 人校验，FIFO 200 条）+ `GET /cba/lineups?count=N`（随机洗牌发池，支持 exclude 排除自己） |
| `index.html` | squad-share 引用（?v=1）+ glue 版本 g（bootSquadShare 初始化 __CBA_PVPSYNC__） |

## 三、验证结果

| 项 | 结果 |
|---|---|
| 四文件语法（glue/squad/bundle/云函数） | ✅ |
| pool20 单元测试 | ✅ 20 长度、队名唯一、前 N 替换玩家阵容（"测试经理甲 的球队"→王哲林/贺希宁/白昊天/韩德君/原帅）、后 18 队官方保留 |
| 真实云函数 lineup 路由 | ⏳ **待用户重新部署云函数**（当前线上是旧版无此路由，实测返回默认响应） |
| Lamps 真机 dataLoad 榜源 | 预留（上传后验证） |

## 四、需要你做的

**更新云函数代码**（1 分钟）：
1. 云函数控制台 → 函数代码 → 在线编辑
2. 把 `CBA梦幻经理2\relay\scf\index.web.js` 的**全部内容**替换 `app.js`（保留 scf_bootstrap 不动）
3. 部署 → 访问 `你的URL/cba/lineups?count=3` 应返回 `{"code":0,"data":{"lineups":[]}}`（空池）

部署完成后我这边 P2 立即生效（游戏启动自动上报你的阵容+拉对手池）。

## 五、设计说明

- **内存池**：实例存活期共享，回收后池重建——玩家会自动重新上报，可接受；量大后升级持久化（COS/数据库）
- **降级链**：池空时引擎用官方 20 队模拟阵容（原版行为），无感降级
- **隐私**：上报内容仅昵称+5 名球员（公开阵容数据），无其他信息
- 引擎消费兼容：注入条目结构与 Qg 完全一致（team/starters/playerId/name/position），引擎断言（20 队、名字唯一、5 人 starter）全部满足；球员 rating 由引擎从目录计算（playerDisplayRating_），目录外球员由引擎跳过——**阵容里必须用目录内球员**（游戏内签约的都在目录内，天然满足）
