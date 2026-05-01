# Rules

`Rules` 现在是一个面向 Stash、Mihomo、Surge 的**策略发行仓**，不是“订阅模板仓”。

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
- `dist/surge/module.sgmodule`
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
   - Mihomo / Clash Party：先导入 `Sub-Store` 输出的节点，再把覆写脚本指向 `dist/mihomo/override.js`。
   - Surge：先让 profile 通过 `Sub-Store` 或远程 `#!include` 拿到真实代理节点，再叠加 `dist/surge/module.sgmodule`。

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

### Mihomo / Clash Party

1. 用 `Sub-Store` 把原始订阅整理成标准代理订阅。

2. 在客户端里先导入这份节点订阅。
   先确认客户端已经能看到真实节点，再做覆写。

3. 把覆写脚本指向 `dist/mihomo/override.js`。
   这个入口会基于现有节点去生成地区组、业务组和规则集引用。

4. 如需进一步私有化：
   节点重命名、节点过滤、机场信息去噪继续放在 `Sub-Store`，不要回写到本仓库。

### Surge

1. 先用 `Sub-Store` 准备一个 Surge 可消费的代理源。
   可以是代理列表、远程 `[Proxy]` 片段，或你自己维护的可 include 远端片段；关键是 Surge 在叠加本仓模块前必须已经有真实节点。

2. 在 Surge 中先导入基础 profile。
   这个 profile 只负责拿到节点来源，不负责承载完整分流策略。

3. 再叠加 `dist/surge/module.sgmodule`。
   本仓模块负责分组、规则和从已有 `[Proxy]` 中筛选节点，不再负责把原始订阅转换成 Surge 节点。

4. 如果节点名需要进一步整理：
   优先在 `Sub-Store` 完成，再让本仓模块按地区正则和业务分组消费这些节点。

### 什么时候用 Script Hub

- 需要运行时脚本、面板、网络请求拦截脚本时，用 `Script Hub`
- 需要订阅解析、节点筛选、去噪、改名、跨客户端输出时，用 `Sub-Store`
- 需要统一的策略组、规则集和客户端入口时，用本仓库

可以把三者理解成一条流水线：

`订阅链接 -> Sub-Store -> 客户端拿到节点 -> 本仓库入口 -> Script Hub 承接运行时脚本`

## 运行时模块支持矩阵

当前实现采用“轻默认 + 可选运行时能力”：

| 能力 | Stash | Surge | Mihomo / Clash |
| --- | --- | --- | --- |
| Rewrite | Full | Full | Partial |
| Script | Full | Full | Unsupported |
| MITM | Full | Full | Unsupported |

解释：

- `Full`：该客户端可以消费对应能力；默认入口不强制注入。
- `Partial`：本仓库保留统一模型和元数据，但不会在该客户端入口里生成完整等价能力。
- `Unsupported`：本仓库只在索引和文档里声明，不伪造产物。

当前内置的运行时模块以常见场景为主，但默认 `emitByDefault=false`，只保留在 `dist/modules/index.json` 元数据里：

- `assistant-panel`
  面向 AI 场景的脚本模块，Stash / Surge 可按需消费。
- `reject-tracking`
  基础改写模块，用于清理常见追踪参数。
- `tls-hosts`
  基础 MITM 主机集合，供 Stash / Surge 私有入口按需渲染。

默认公开入口不下发 rewrite/script/MITM，避免通用策略包影响页面行为、触发证书解密或增加运行时开销。`Mihomo / Clash` 的入口目前会显式暴露运行时能力降级信息，但不会伪造脚本或 MITM 段，避免形成“看起来支持、实际上不可用”的假象。

## 构建

仓库无额外依赖，使用系统 Node.js 即可：

```bash
node scripts/build.js
```

构建会刷新 `dist/` 下的模块索引和三类客户端入口产物。

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
