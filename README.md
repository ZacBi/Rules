# Rules

`Rules` 现在是一个面向 Stash、Mihomo、Surge、Quantumult X 的**策略发行仓**，不是“订阅模板仓”。

默认前提是：订阅解析、节点清洗、格式转换已经由客户端能力或前置工具完成，例如 `Sub-Store`、`Script Hub`，以及客户端自带的覆写、重写、脚本、MITM 能力。本仓库只负责维护统一策略模型，并输出可远程引用的轻量策略产物。

仓库是公开的，因此**不会包含**真实订阅链接、token、Cookie、个人路径或其他私有材料。

## 产物形态

仓库使用三层策略模型：

- `base`：基础策略能力，例如健康检查、地区识别、通用分组、基础分流、rewrite/script/MITM 元数据。
- `scenario`：业务场景模块，例如 AI、流媒体、开发工具、即时通讯、广告拦截、国内直连。
- `client`：客户端适配层，将统一语义渲染成各客户端入口产物。

构建后正式对外入口位于 `dist/`：

- `dist/stash/stash.stoverride`
- `dist/mihomo/override.js`
- `dist/mihomo/clash-party.js`
- `dist/surge/module.sgmodule`
- `dist/quantumultx/rules.conf`
- `dist/modules/index.json`

其中 `index.json` 是机器可读模块索引，描述模块标识、层级、支持客户端、依赖关系和能力矩阵。

## 推荐使用路径

1. 在客户端或前置工具中处理订阅。
   `Sub-Store`、`Script Hub`、客户端自带能力负责解析订阅与清洗节点。

2. 选择客户端入口产物。
   直接引用 `dist/` 下对应客户端的入口文件，而不是再从仓库拿完整模板。

3. 按需叠加场景模块。
   常见用户可以只用客户端入口；需要细分业务分流时，再围绕统一模型扩展或组合模块。

4. 在私有环境里做个性化配置。
   订阅、凭据、私有规则源、企业域名等内容应保留在本地或私有副本里。

## 从一个订阅链接开始

如果你手里只有一条机场订阅链接，推荐按下面的顺序处理：

1. 把订阅链接交给 `Sub-Store`。
   不要直接让仓库产物承担订阅解析。先在 `Sub-Store` 里创建一个上游 source，把原始订阅变成可复用的中间订阅。

2. 在 `Sub-Store` 里为不同客户端准备输出。
   - Stash / Mihomo：输出标准代理订阅，让客户端先拿到节点。
   - Surge：输出 Surge 可识别的代理列表或代理片段，让客户端本身先拥有 `[Proxy]` 节点池。

3. 先在客户端导入 `Sub-Store` 产物，再叠加本仓库入口。
   - Stash：先导入 `Sub-Store` 输出的节点订阅，再追加远程覆写 `dist/stash/stash.stoverride`。
   - Clash Party：优先用内置 `Sub-Store` 管理原始订阅，再用链接导入远程覆写 `dist/mihomo/clash-party.js`。
   - 其他 Mihomo 客户端：若支持 JavaScript 覆写，可使用 `dist/mihomo/override.js`；若只支持 YAML 订阅，则需要先生成最终配置。
   - Surge：先让 profile 通过 `Sub-Store` 或远程 `#!include` 拿到真实代理节点，再叠加 `dist/surge/module.sgmodule`。
   - Quantumult X：先导入节点订阅，再引用 `dist/quantumultx/rules.conf` 作为轻量懒人配置。

4. 需要运行时脚本时，再打开 `Script Hub`。
   `Script Hub` 适合承接脚本、重写、MITM 这类客户端运行时能力；本仓库负责给出统一策略入口，不负责托管个人脚本状态。

5. 最后再做私有化微调。
   包括节点重命名、去噪、地区优先级、私有域名直连、企业内网例外等，都应该留在 `Sub-Store` 规则或客户端本地设置里，而不是写回公开仓库。

这条链路的原则是：

- `Sub-Store` 负责“把一个订阅链接整理成客户端能消费的节点源”
- `Script Hub` 负责“承接脚本化运行时能力”
- 本仓库负责“提供统一的分组、规则和可选运行时模块元数据”

## 按客户端落地

下面这部分是更接近实际操作的顺序。界面名称可能会随着客户端版本微调，但整体流程不变。

### Stash

1. 在 `Sub-Store` 中新增一个 source。
   输入你的原始订阅链接，让 `Sub-Store` 先完成解析和去噪。

2. 在 `Sub-Store` 中新增一个 Stash 输出。
   输出目标保持为“节点订阅”，不要在这里再塞完整规则模板。

3. 在 Stash 里先导入 `Sub-Store` 输出的节点订阅。
   这一步的目标是让 Stash 的代理列表里先出现真实节点。

4. 再给这个 profile 追加远程覆写。
   覆写入口使用 `dist/stash/stash.stoverride`，让本仓库负责分组、规则和节点筛选策略。

5. 如果需要脚本化能力，再在 `Script Hub` 中启用对应脚本。
   原则是节点整理放在 `Sub-Store`，运行时脚本放在 `Script Hub`，不要让一个组件同时做两件事。

Stash 入口默认按 iOS 交互优化：

- 策略组优先展示“全部节点、自动选择、节点选择、业务场景”，地区组放在后面作为细分选择。
- 每个策略组都带图标，方便在 Stash 的策略组页面快速识别。
- 节点筛选会过滤剩余流量、到期、官网、订阅等信息行，减少无效策略项。
- 内置常见全球服务核心域名的 inline 分流兜底，减少远程规则集未更新或未加载时的启动期连接失败。
- 默认只注入少量常见 HTTP 改写和脚本，来源使用受欢迎的开源上游，不在本仓库自写脚本。
- 当前内置 Stash 运行时能力包括 APP 更新检查屏蔽和 TestFlight 下载修正；更重的广告复写、解锁或私有脚本仍建议单独在 Stash / Script Hub 中按需导入。

可选运行时能力仍会保留在 `dist/modules/index.json` 的元数据里：

- 主入口 `stash.stoverride` 只生成低数量、低风险的 `http.rewrite`、`http.script` 和对应 `http.mitm` 主机。
- 脚本元数据标注 `require-body`、`max-size` 等性能约束，默认不内联 payload。
- MITM 主机按实际启用模块拆分记录，只覆盖对应上游规则需要的域名。
- 旧的 tracking 参数 rewrite 不再输出；宽泛 302 改写容易丢路径或查询参数，后续如需启用应在私有侧改成路径保持的脚本实现。

DNS 解析失败不是规则集能完全解决的问题。如果 Stash 日志出现 `couldn't find ip`：

- 优先在 Stash 本地启用 Fake IP，避免代理请求依赖本地 DNS 解析境外域名。
- DNS 服务器控制在 1-2 个稳定可达的本地 DNS；不要在公开覆写里强行接管 `nameserver` 或全局开启 `follow-rule`。
- 如需特殊 DNS 策略，应放在用户自己的本地覆写或独立可选模块里，而不是并入公开主入口。

### Clash Party

1. 打开 Clash Party 内置 `Sub-Store`。
   不需要单独安装 Sub-Store 服务；原始订阅在本机客户端内处理。

2. 在内置 `Sub-Store` 里新增 source，填入原始订阅链接。

3. 新增 Clash.Meta / Mihomo 输出，并把输出订阅导入 Clash Party。
   先确认客户端已经能看到真实节点，再做覆写。

4. 在“覆写”里用链接导入 `dist/mihomo/clash-party.js`。
   这个入口不包含 CommonJS 导出，适合 Clash Party 远程 JavaScript 配置覆写。

   ```text
   https://raw.githubusercontent.com/ZacBi/Rules/master/dist/mihomo/clash-party.js
   ```

5. 回到订阅管理，把刚导入的覆写绑定到对应订阅。

6. 更新订阅并启用配置。

7. 注意 Clash Party 的“覆写”是修改 Mihomo 配置，不是 Stash / Surge 的 HTTP URL 改写。
   本入口只生成策略组、规则集和分流规则，不下发 rewrite、script 或 MITM。

8. 如需进一步私有化：
   节点重命名、节点过滤、机场信息去噪继续放在内置 `Sub-Store`，不要回写到本仓库。

### 其他 Mihomo 客户端

1. 先确认客户端已经能消费节点订阅。

2. 如果客户端支持 JavaScript 覆写，可使用 `dist/mihomo/override.js`。
   这个入口保留 `module.exports`，方便 Node 环境和兼容 CommonJS 的工具链检查。

3. 如果客户端只支持远程 YAML 订阅，不能直接使用本仓库的 JS 覆写链接。
   这种场景需要由私有服务或前置工具先合成最终 Mihomo 配置，再把最终 YAML URL 交给客户端。

### Surge

1. 先用 `Sub-Store` 准备一个 Surge 可消费的代理源。
   可以是代理列表、远程 `[Proxy]` 片段，或你自己维护的可 include 远端片段；关键是 Surge 在叠加本仓模块前必须已经有真实节点。

2. 在 Surge 中先导入基础 profile。
   这个 profile 只负责拿到节点来源，不负责承载完整分流策略。

3. 再叠加 `dist/surge/module.sgmodule`。
   本仓模块负责分组、规则和从已有 `[Proxy]` 中筛选节点，不再负责把原始订阅转换成 Surge 节点。

4. 如果节点名需要进一步整理：
   优先在 `Sub-Store` 完成，再让本仓模块按地区正则和业务分组消费这些节点。

### Quantumult X

1. 先用 `Sub-Store` 处理原始订阅，并输出 Quantumult X 可消费的节点订阅。
   本仓入口不包含 `[server_remote]`，不会托管真实订阅地址。节点解析、改名、去噪、协议兼容和机场信息处理都应留在 `Sub-Store` 或你的私有 profile 中。

2. 再引用 `dist/quantumultx/rules.conf` 作为轻量懒人配置。
   该入口生成空 `[general]`、`[policy]`、`[filter_remote]` 和 `[filter_local]`，负责常用策略组、远程规则集、国内直连、广告拦截和漏网兜底。

   ```text
   https://raw.githubusercontent.com/ZacBi/Rules/refs/heads/master/dist/quantumultx/rules.conf
   ```

3. 如需节点改名、去噪或机场信息清理：
   继续放在 `Sub-Store`，不要写回公开仓库。

Quantumult X 入口定位为公开安全的轻量懒人配置：导入节点后，再引用本入口即可获得常用分组和分流。它默认使用 `blackmatrix7/ios_rule_script` 的原生 Quantumult X 分流规则，不对这类 `.list` 资源启用 parser。Profiles4limbo、ddgksf2013、Toperlock 等个人懒人配置可作为私有配置参考，但不会被整包并入本仓公开入口。

### 什么时候用 Script Hub

- 需要运行时脚本、面板、网络请求拦截脚本时，用 `Script Hub`
- 需要订阅解析、节点筛选、去噪、改名、跨客户端输出时，用 `Sub-Store`
- 需要统一的策略组、规则集和客户端入口时，用本仓库

可以把三者理解成一条流水线：

`订阅链接 -> Sub-Store -> 客户端拿到节点 -> 本仓库入口 -> Script Hub 承接运行时脚本`

## 运行时模块支持矩阵

当前实现采用“轻默认 + 可选运行时能力”：

| 能力 | Stash | Surge | Mihomo / Clash Party | Quantumult X |
| --- | --- | --- | --- | --- |
| Rewrite | Full | Full | Unsupported | Metadata only |
| Script | Full | Full | Unsupported | Metadata only |
| MITM | Full | Full | Unsupported | Metadata only |

解释：

- `Full`：该客户端可以消费对应能力；默认入口不强制注入。
- `Unsupported`：本仓库只在索引和文档里声明，不伪造产物。
- `Metadata only`：索引保留能力元数据，公开入口当前只渲染策略和分流。

当前内置的运行时模块以常见场景为主：

- `assistant-panel`
  面向 AI 场景的脚本模块，当前未绑定可用上游脚本 URL，不默认下发。
- `reject-tracking`
  仅保留风险元数据，不再渲染；宽泛 302 改写容易破坏页面状态。
- `app-upgrade-check-block`
  引用 `blackmatrix7/ios_rule_script` 的 Stash APP 更新检查屏蔽复写子集，默认下发。
- `testflight-download-fix`
  引用 `blackmatrix7/ios_rule_script` 的 TestFlight 下载修正脚本，默认下发。
- `openai-tls-hosts`、`anthropic-tls-hosts`、`githubusercontent-tls-hosts`
  拆分后的 MITM 主机集合，仅保留元数据，供私有入口按需渲染。

默认公开入口只下发小规模 Stash rewrite/script/MITM，避免通用策略包过重。`Mihomo / Clash Party` 的入口目前只处理配置覆写和分流规则，不伪造 rewrite、script 或 MITM 段，避免形成“看起来支持、实际上不可用”的假象。

## 构建

仓库无额外依赖，使用系统 Node.js 即可：

```bash
node scripts/build.js
```

构建会刷新 `dist/` 下的模块索引和客户端入口产物。

推送到 `master` 后，GitHub Actions 会自动运行构建，并在产物变化时提交刷新后的 `dist/` 文件。Pull Request 中同一工作流只做校验，要求源码与生成产物保持同步。

如需让 Cursor 规则集 raw 地址指向你的 fork，可在构建时设置：

```bash
RULES_GITHUB_REPO='owner/repo' node scripts/build.js
```

未设置时，默认公开产物不会包含 Cursor 补充规则集。

## 规则与资源原则

- 优先使用 `blackmatrix7/ios_rule_script` 的远程规则源。
- 不在仓库里复制大型 ruleset。
- 客户端差异必须显式建模，不把某一客户端专属能力伪装成通用策略。
- 小型本地补充只在确有必要时保留。

## 迁移说明

以下旧入口已经废弃，不再作为主产物维护：

- `mihomo/mihomo-public.yaml`
- `surge/surge-public.conf`
- `mihomo/stash/stash-subscription-only.stoverride.yaml`

旧模式是“先生成完整配置，再替换订阅”。新模式是“先在客户端侧解决订阅问题，再引用仓库发行的策略模块”。

这次重构同时带来这些变化：

- 不再公开维护占位订阅模板或私有示例配置。
- 旧 `shared/*` 定义已被统一策略模型替代。
- 新的公开接口从“配置文件路径”改为 `dist/` 下的模块化远程产物路径。

如果你仍在使用旧文件，应尽快迁移到新的 `dist/` 入口。

## 目录

```text
policy/         # 统一策略模型与模块定义
dist/           # 构建产物：模块索引 + 客户端入口
scripts/        # 构建脚本与历史辅助脚本
mihomo/ruleset/ # 少量需要由仓库托管的规则集
rules/          # 小型补充列表
```

`scripts/` 现在只保留构建链本身，不再维护旧的订阅转换与占位注入流程。
