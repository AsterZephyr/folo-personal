# Folo Personal：本地 AI 与双语 RSS 配置手册

这份文档给维护者或 AI agent 使用。它描述的是当前 `codex/personal-ai` 分支已经做好的东西，以及一台新 Mac 需要怎样配置才能得到相同的结果。

## 先看整体结构

这套方案由两个相互独立的部分组成：

```text
Folo Personal（Mac 应用）
  ├─ 账户、订阅、文章、已读状态 ─────── Folo 官方服务
  └─ 聊天、摘要、翻译、时间线分析 ────── 本机配置的模型网关

Folo CLI ── 管理订阅与登录态
    │
    └─ Folo 中只订阅公开的双语 RSS
             ▲
             │
rss.asterzephyr.xyz
  ├─ 从 Folo 拉取允许列表中的源
  ├─ 用自己的 Anthropic-compatible API 翻译
  └─ 将中文译文与英文原文写入 RSS
```

Folo Personal 本身不会把自己的 API Key 交给 Folo 官方服务。应用内的 API Key 只在本机通过 macOS safeStorage 保存；双语 RSS 服务则在 Vercel 服务端保存另一份服务端凭据。两者都不把密钥写入仓库，也不应写入 README、日志或构建产物。

## 这次二开改了什么

### 本机 AI

- 在桌面端增加“本机 AI”配置：协议、Base URL、模型和 API Key 可以在设置中填写，并可直接测试。
- 聊天、当前文章问答、订阅源和分类问答、时间线分析、摘要、标题翻译和正文翻译都可以直接调用自己的模型网关，不要求 Folo AI 订阅。
- 本机模式没有官方 AI 回退。网关失败会显示错误，避免用户以为请求仍然走了官方服务。
- 时间线分析使用发送时选择的范围，最多取最近 50 条，并在结果中说明实际条数、时间范围和是否截断。
- 推荐订阅源先查 Folo 的真实目录，排除已经订阅的源，再由本机模型筛选；它不会自动订阅，也不伪装成任意网页搜索。
- 关闭本机 AI 后，摘要区隐藏，本地聊天不会转发到官方 AI。

主要实现位置：

- 主进程本地请求和安全 IPC：`apps/desktop/layer/main/src/lib/local-ai.ts`、`apps/desktop/layer/main/src/ipc/services/local-ai.ts`。
- CLI 登录态导入：`apps/desktop/layer/main/src/lib/cli-session-sync.ts`、`apps/desktop/layer/main/src/ipc/services/auth.ts`。
- 渲染进程本地传输和上下文：`apps/desktop/layer/renderer/src/lib/local-ai.ts`、`apps/desktop/layer/renderer/src/modules/ai-chat/store/local-transport.ts`、`apps/desktop/layer/renderer/src/modules/ai-chat/store/local-context.ts`。
- 设置页和开关：`apps/desktop/layer/renderer/src/modules/settings/tabs/ai/LocalAISection.tsx`、`apps/desktop/layer/renderer/src/modules/settings/tabs/ai.tsx`。
- 摘要和翻译的本机分支：`packages/internal/store/src/modules/summary/`、`packages/internal/store/src/modules/translation/`。
- 本地版应用身份、更新策略和图标替换：`apps/desktop/forge.config.cts`、`apps/desktop/layer/main/src/updater/configs.ts`、`icons/mingcute-free/`。

### 登录与数据隔离

- Folo CLI 的登录态只读导入，不修改原版 CLI 配置。
- 原版 CLI 配置通常在 `~/.folo/config.json`；个人版自己的配置在 `~/.folo-personal/config.json`。
- 个人版使用独立的应用身份和数据目录：`~/Library/Application Support/Folo Personal`。
- 开发模式使用 `Folo Personal(dev)`，不会和正式个人版混用数据。
- 原版应用、原有订阅和双语 RSS 服务不会被个人版安装替换。

### 界面和付费提示

- 阅读区隐藏免费试用和升级 Pro 的摘要推广卡。
- 本地摘要、翻译和双语模式的开关独立保存在本机，不随账户会员状态同步。
- 个人版关闭上游二进制和 renderer 自动更新；升级需要重新构建和安装。

## 在新 Mac 上配置个人版

### 1. 准备环境

仓库是 pnpm workspace，当前基线是 RSSNext/Folo `desktop/v1.15.0`（`b7b6e3a`）。需要 Node、pnpm 和 macOS 的 Electron 构建环境。

```sh
git clone https://github.com/AsterZephyr/folo-personal.git
cd folo-personal
git checkout codex/personal-ai
pnpm install
```

不要把自己的 `.env`、Folo 账号缓存、`~/.folo`、钥匙串项目或应用数据目录复制进仓库。

### 2. 登录 Folo CLI

CLI 已作为全局命令安装时，先确认：

```sh
folo --version
folo whoami
```

没有命令时安装与当前项目对应的 CLI 包：

```sh
npm install -g folocli
folo login
folo whoami
```

个人版登录页选择“使用已登录的 Folo CLI 账号”即可。应用会读取 CLI 会话，之后只在自己的 `~/.folo-personal/config.json` 中保存个人版状态。

### 3. 配置本机 AI

打开 **设置 → AI → 本机 AI**，填写：

| 字段 | 配置方式 |
| --- | --- |
| 协议/提供商 | 选择应用支持的 Anthropic 或 OpenAI-compatible 入口；不要为了让模型列表出现而改动接口格式 |
| Base URL | 填网关根地址；如果网关要求 `/v1`，把 `/v1` 写进地址 |
| 模型 | 填网关实际接受的模型名，例如 `DeepSeek-V4.1-Flash` |
| API Key | 填自己的 Key；不要提交到 Git |

点击“保存并测试”。测试成功后再打开通用设置中的 AI 翻译和双语对照。API Key 会通过 macOS safeStorage 加密保存，代码、账户同步和 RSS 服务都不会读取这份本机密钥。

更换自行构建的安装包后，macOS 可能再次询问是否允许访问 `Folo Personal Safe Storage`。这是正常的钥匙串授权流程：在系统弹窗中允许当前应用，必要时输入 Mac 登录密码。不要删除钥匙串项目，也不要把访问范围放宽到所有应用。

### 4. 构建和安装

先按仓库规则执行质量检查：

```sh
pnpm run typecheck
pnpm run lint:fix
pnpm run test
```

然后构建 Apple Silicon 版本：

```sh
pnpm --filter @follow/electron-main run build
pnpm --dir apps/desktop run build:electron-vite
pnpm --dir apps/desktop exec electron-forge make \
  --platform=darwin \
  --arch=arm64 \
  --targets=@electron-forge/maker-zip
```

没有 `OSX_SIGN_IDENTITY` 时是 ad-hoc 签名，不是 Apple 开发者证书签名，也不会自动公证。网络不稳定时，可以把 `FOLO_ELECTRON_ZIP_DIR` 指向已经按官方校验和验证过的 Electron ZIP 目录。

## 双语 RSS 服务

服务代码位于另一份本地仓库：`/Users/hxz/code/folo-bilingual-rss`。线上地址是：

```text
https://rss.asterzephyr.xyz
```

Folo 只订阅 `/feeds/<source-id>.xml`。公开读取只读缓存，不会因为有人打开 RSS 就触发模型调用。

### 需要配置的服务端变量

这些变量只放在 Vercel 项目环境中：

```text
BLOB_READ_WRITE_TOKEN   Vercel Blob 读写凭据
FOLO_TOKEN              Folo 当前登录会话令牌
CRON_SECRET             手动刷新接口的 Bearer 密钥
ANTHROPIC_BASE_URL      Anthropic-compatible 网关地址
ANTHROPIC_AUTH_TOKEN    翻译服务令牌
ANTHROPIC_MODEL         实际可用的模型名
PUBLIC_BASE_URL         可选，用于运维和导出链接
```

变量不能写进 `sources.json`、前端代码、GitHub Actions 日志或文档。服务会向 `${ANTHROPIC_BASE_URL}/v1/messages` 发起 Anthropic 格式请求，并使用 Bearer 认证。

首次部署或更换配置时：

```sh
cd /path/to/folo-bilingual-rss
vercel link
vercel env add BLOB_READ_WRITE_TOKEN production --value '<value>' --sensitive --yes
vercel env add FOLO_TOKEN production --value '<value>' --sensitive --yes
vercel env add CRON_SECRET production --value '<value>' --sensitive --yes
vercel env add ANTHROPIC_BASE_URL production --value '<value>' --yes
vercel env add ANTHROPIC_AUTH_TOKEN production --value '<value>' --sensitive --yes
vercel env add ANTHROPIC_MODEL production --value '<value>' --yes
vercel deploy --prod --yes
```

不要把真实值替换进文档后提交。更新环境变量后必须重新部署，运行中的 Vercel 函数才会读取新值。

### RSS 服务的工作方式

1. `sources.json` 是唯一允许列表，每个来源有稳定的 Folo feed ID、名称、分类、原始 URL 和展示类型。
2. 定时任务或授权的 `/api/refresh?feed=<id>&limit=1` 从 Folo 取最新条目。
3. 文章进入持久化队列后，按文本块调用自己的模型翻译标题和正文。
4. 只有完整翻译的文章才写入 Vercel Blob 并出现在 RSS 中；失败会保留上一次成功缓存。
5. 每个源每日最多开始 3 篇、最多 24 次模型请求，单个 RSS 保留最近 30 篇完整文章。

手动刷新需要：

```sh
curl -H "Authorization: Bearer $CRON_SECRET" \
  'https://rss.asterzephyr.xyz/api/refresh?feed=<source-id>&limit=1'
```

返回 `translation_pending` 或 `retry_pending` 不代表 RSS 结构损坏，分别表示还有翻译队列或等待重试。查看 RSS 时只应验证 XML 和已完成文章数量，不能把 HTTP 200 当成“所有文章已经翻完”。

## 当前订阅目录

当前 Folo 中保留 66 个订阅，全部指向双语 RSS，不再同时保留原文直连：

| Folo 分类 | 数量 | 代表性来源 |
| --- | ---: | --- |
| `AI·基础模型与研究` | 11 | Google Research、Anthropic Research、BAIR、Microsoft Research、The Gradient、arXiv |
| `AI·RL与对齐` | 3 | Lilian Weng、Nathan Lambert、arXiv Machine Learning |
| `AI·Infra与系统` | 5 | AWS ML、Databricks、NVIDIA、vLLM、Eugene Yan |
| `AI·公司与产品` | 5 | Sam Altman、Anthropic Engineering、Latent Space、fast.ai |
| `AI·KOL·X` | 21 | Dario Amodei、Andrej Karpathy、Boris Cherny、Jim Fan、Yann LeCun、swyx、Noam Brown、Dwarkesh Patel |
| `VC·AI投资` | 13 | a16z、Sequoia、YC、First Round、Founders Fund、Lightspeed、Sarah Guo、Paul Graham、Marc Andreessen |
| `商业化·产品增长` | 5 | Lenny、Stratechery、Benedict Evans、Andrew Chen |
| `广告·营销与媒体` | 3 | Digiday、AdExchanger、Marketing Dive |

来源筛选参考了公开 RSS/OPML 汇总和 AI research feed 清单，再按可用性、稳定性和个人目标方向筛选。X/Twitter 源依赖 RSSHub 或 X RSS 服务，某个上游路由失效时应替换源，不要把临时错误订阅无限重试。

### 用 CLI 管理订阅

全局 CLI 的配置保存在 `~/.folo/config.json`。常用操作：

```sh
folo subscription list
folo feed get '<feed-url-or-id>'

folo subscription add \
  --feed 'https://rss.asterzephyr.xyz/feeds/<source-id>.xml' \
  --category 'AI·KOL·X' \
  --view social \
  --title '作者 · X'

folo subscription update <subscription-id> \
  --category 'AI·RL与对齐' \
  --title '来源名' \
  --view articles

folo subscription remove <subscription-id>
```

新增双语源时，先在双语服务的 `sources.json` 增加允许列表和 `vercel.json` 定时任务，部署后再执行 `subscription add`。不要直接把原始 RSS 和双语 RSS 同时订阅，否则会在 Folo 里形成重复文章。

## 验收清单

### 个人应用

- [ ] `folo whoami` 能返回当前账号。
- [ ] 个人版可以导入 CLI 登录态，但不会覆盖 `~/.folo/config.json`。
- [ ] 本机 AI 的“保存并测试”成功。
- [ ] 打开一篇文章，摘要、标题翻译和正文翻译走自定义网关。
- [ ] 对当前文章、订阅源、分类和时间线提问都能得到回答。
- [ ] 推荐源来自真实 Folo 目录，不会自动订阅。
- [ ] 关闭本机 AI 后不会回退到官方 AI。
- [ ] 重新安装后，钥匙串授权和本地历史仍可恢复。

### 双语 RSS

- [ ] `curl https://rss.asterzephyr.xyz/feeds/<source-id>.xml` 返回合法 RSS。
- [ ] RSS 标题和正文同时包含中文译文与英文原文链接。
- [ ] 生产环境变量未出现在 Git、构建日志和错误响应中。
- [ ] `npm test` 通过；当前服务测试为 13 个通过。
- [ ] Folo 中没有 `Recommended` 杂项、Welcome 源或原文/双语重复。
- [ ] `folo subscription list` 的目录数量与分类数量符合预期。

## 故障排查

### 本机 AI 请求失败

先检查 Base URL 是否带了网关要求的 `/v1`，模型名是否是网关实际支持的值，再重新点击“保存并测试”。如果 macOS 刚弹过钥匙串授权，等待授权结束后重试。不要用官方 AI 订阅状态判断本机配置是否正确。

### RSS 返回空频道

空频道通常表示该 source 还没有完成首次缓存。先用授权刷新接口查看 `status`、`pending` 和 `cached`，等待队列完成后再刷新 Folo。若一直 `retry_pending`，检查 `FOLO_TOKEN` 是否过期、源 ID 是否仍存在、模型网关是否能响应 Anthropic `/v1/messages`。

### X 源停止更新

X 源不是 Folo 官方原生 RSS，通常依赖 RSSHub 或第三方 X RSS 服务。检查 `folo feed get` 的 `errorMessage`；如果是上游路由失效，保留分类和标题，替换 `sources.json` 中的 URL 后重新部署并建立新的双语 source ID。

### 构建后再次询问钥匙串

这是 ad-hoc 应用身份变化后的正常现象。允许当前应用访问 `Folo Personal Safe Storage`，不要删除密钥，也不要把权限改成所有应用。

## 发布和回滚边界

- 公开仓库是非官方个人分支，不代表 RSSNext/Folo 官方发行版。
- 保留根目录 `LICENSE`、上游版权声明和各组件许可证；整体许可证仍是 AGPL-3.0。
- 当前公开源只保留清理后的单提交快照，历史中不应重新带回受限制的 `icons/mgc`。个人版使用另有许可的 `icons/mingcute-free`，并保留对应归属文件。
- 不要上传 API Key、Folo 会话、Vercel 环境文件、应用 profile、钥匙串项目或安装包中的用户数据。
- 本次只公开源代码和配置文档；自动更新、Vercel 发布站点、Apple 公证和正式安装包发布都是独立动作。
- 回滚应用时保留上一份可运行的 app bundle，不要删除或迁移 `~/Library/Application Support/Folo Personal`。
- 回滚 RSS 服务时恢复上一份 `sources.json`、环境变量和 Vercel 部署；不要清空 Blob，否则会丢失已经完成的翻译缓存。

## 给 AI agent 的最短执行顺序

1. 读取 `AGENTS.md`、`PERSONAL.md` 和本文件，不要猜测配置。
2. 检查工作区、分支、远程仓库和 Git 状态。
3. 检查所有候选密钥只存在于本机安全存储或 Vercel 环境，不进入补丁。
4. 先运行 typecheck、lint、test，再做构建或发布。
5. 修改个人 AI 时，保持“本机直连、无官方 AI 回退、独立数据目录”的边界。
6. 修改双语 RSS 时，先更新允许列表和定时任务，再部署，再让 Folo CLI 订阅双语 URL。
7. 任何订阅源只保留一个版本；默认使用双语源，不创建原文/双语两套目录。
8. 发布前验证许可证、图标来源、远程地址、分支和可见性；不要把上游 `RSSNext/Folo` 当成个人仓库的 `origin`。
