# Folo Personal（Mac 自用版）

基于 Folo desktop/v1.15.0（b7b6e3a）修改，保留原项目许可证和版权声明。

## 使用方式

1. 打开 **Folo Personal**。它与原版 Folo 使用不同的应用身份和数据目录。
2. 登录页选择“使用已登录的 Folo CLI 账号”，或使用邮箱登录。订阅、文章和已读状态仍由 Folo 官方服务同步；官方服务本身的限制继续适用。
3. 设置 → AI → 本机 AI：填写协议、Base URL、模型和 API Key，启用后点击“保存并测试”。OpenAI 兼容地址通常包含 `/v1`；模型名可手动填写，不依赖模型列表。
4. 本机模式下，聊天、文章/订阅源/分类/时间线问答、摘要和标题/正文翻译直接请求配置的模型网关，不要求 Folo AI 订阅。模型网关可能按用量收费。
5. 在通用设置中开启 AI 翻译，选择双语对照。自用版的翻译开关、双语模式和摘要开关独立保存在此 Mac，不受账户会员等级影响，也不上传到账户设置。翻译按需执行并缓存，不生成新的 RSS 源。
6. 阅读区不显示免费试用或升级 Pro 的摘要推广卡。本机 AI 关闭时隐藏摘要区；开启后显示实际摘要，调用失败时显示错误。

## 时间线和推荐

- 时间线分析只读取发送时选择的范围，最多使用最近 50 条。结果注明实际条数、时间和截断情况，不代表所有历史内容；切换页面不会改变已发送问题的范围。
- 聊天中的重要性排序给出这批条目的阅读顺序与理由，不更改官方时间线的排序设置。
- 推荐订阅源先检索 Folo 的真实目录，排除已订阅源，再使用本机配置的模型筛选。推荐结果保留真实来源链接，不自动订阅，不提供通用网页搜索。
- 目录或模型请求失败时显示实际错误，保留可重试的输入。取消后不继续后续模型调用；不会回退到官方付费 AI。

## 数据和边界

- API Key 使用 macOS safeStorage 加密后保存在个人版数据目录，不进入 Folo 账户设置同步。
- macOS 数据目录：`~/Library/Application Support/Folo Personal`；开发模式使用 `Folo Personal(dev)`。
- 原版 CLI 登录只读导入；个人版只写 `~/.folo-personal/config.json`。
- 本机聊天保存在本地；关闭本机 AI 后，这些会话会拒绝转发到官方 AI。
- 网关失败直接报错，无官方 AI 回退。HTTP 网关不提供 TLS 传输加密；支持 HTTPS 时应优先使用 HTTPS。
- 本机模式支持文字聊天、阅读上下文和 Folo 目录检索。不提供任意网页搜索、MCP、云端计划任务或附件分析；这些入口在本机模式下隐藏，拖拽和粘贴文件也不会触发官方上传。答复完成后整段显示，可取消进行中的请求。
- 原版应用、已有双语 RSS 服务和订阅不会被此安装替换。个人版关闭了官方应用和热更新，升级需要重新构建。
- 官方浏览器登录回调仍面向原版 Folo；个人版优先使用上述 CLI 导入或邮箱登录。

## 本地构建

```sh
pnpm install
pnpm --filter @follow/electron-main run build
pnpm --dir apps/desktop run build:electron-vite
pnpm --dir apps/desktop exec electron-forge make --platform=darwin --arch=arm64 --targets=@electron-forge/maker-zip
```

未设置 `OSX_SIGN_IDENTITY` 时使用本地 ad-hoc 签名，保持应用完整性；这不是 Apple 开发者证书签名或公证。不会向上游仓库发布。如果构建网络不稳定，可将 `FOLO_ELECTRON_ZIP_DIR` 指向已经按官方校验和验证过的 Electron ZIP 所在目录。

发布源码或安装包前遵循 [个人版发布说明](./docs/personal-release.md)。上游 `icons/mgc` 图形禁止再分发，本版使用另有 Apache-2.0 许可的开放图标；干净发布仓库不包含旧素材或带有旧素材的 Git 历史。

更换自行构建的安装包后，macOS 可能再次请求访问 `Folo Personal Safe Storage` 钥匙串项目。请在系统弹窗中授权当前应用；如需密码，在系统弹窗内输入 Mac 登录密码。等待授权时 AI 请求可能超时，授权后重新测试即可。不要删除已保存的密钥或将钥匙串访问范围放宽到所有应用。
