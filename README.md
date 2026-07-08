# Rules

`Rules` 是面向 Stash、Mihomo、Surge、Quantumult X 的公开策略发行仓。

本仓库只维护统一策略模型和可远程引用的轻量产物，不托管真实订阅链接、账号凭据、Cookie、本机路径、私有节点或个人运行时配置。订阅解析、节点清洗、改名、去噪和跨客户端格式转换应交给 `Sub-Store`、`Script Hub` 或客户端本地能力处理。

## 入口

正式产物位于 `dist/`：

| 客户端 | 入口 |
| --- | --- |
| Stash | `dist/stash/stash.stoverride` |
| Mihomo | `dist/mihomo/override.js` |
| Clash Party | `dist/mihomo/clash-party.js` |
| Surge module | `dist/surge/module.sgmodule` |
| Surge proxy groups | `dist/surge/proxy-groups.dconf` |
| Surge compact proxy groups | `dist/surge/proxy-groups.compact.dconf` |
| Surge rules | `dist/surge/rules.dconf` |
| Quantumult X | `dist/quantumultx/rules.conf` |
| Quantumult X Sub-Store addon | `dist/quantumultx/sub-store.conf` |
| 模块索引 | `dist/modules/index.json` |

常用远程地址：

```text
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/stash/stash.stoverride
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/mihomo/override.js
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/mihomo/clash-party.js
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/surge/proxy-groups.compact.dconf
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/surge/rules.dconf
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/quantumultx/rules.conf
```

Stash 一键安装覆写：

```text
https://link.stash.ws/install-override/raw.githubusercontent.com/ZacBi/Rules/master/dist/stash/stash.stoverride
```

## 使用方式

推荐链路：

```text
订阅链接 -> Sub-Store -> 客户端拿到节点 -> 本仓库 dist 入口 -> Script Hub 承接可选运行时脚本
```

分工：

- `Sub-Store`：订阅解析、节点清洗、改名、去噪、跨客户端输出。
- 客户端：导入节点、应用策略组、执行分流。
- 本仓库：提供统一策略组、规则集引用、客户端入口产物。
- `Script Hub`：承接脚本、重写、MITM 等运行时能力。

公开入口不应该直接处理原始订阅链接，也不应该写入任何私有订阅地址。

## 客户端接入

### Stash

1. 在 `Sub-Store` 中创建 source，填入原始订阅。
2. 输出 Stash 可消费的节点订阅。
3. 在 Stash 中先导入节点订阅。
4. 对同一个 profile 追加远程覆写：

   ```text
   https://raw.githubusercontent.com/ZacBi/Rules/master/dist/stash/stash.stoverride
   ```

   也可以在 iPhone 上使用一键安装链接：

   ```text
   https://link.stash.ws/install-override/raw.githubusercontent.com/ZacBi/Rules/master/dist/stash/stash.stoverride
   ```

Stash 入口只下发策略组、远程规则集、小规模 rewrite/script/MITM。当前默认运行时能力包括 APP 更新检查屏蔽和 TestFlight 下载修正；更重的广告复写、解锁、面板或私有脚本应在本地或 `Script Hub` 中单独启用。

Stash 专属增强组：

- `香港优先`：`fallback` 组，按香港节点正则引用可用节点，适合手动固定香港线路时使用。
- `媒体负载均衡`：`load-balance` 组，使用 `consistent-hashing`，适合 YouTube、Netflix、Spotify、TikTok 等媒体流量；不默认用于金融或登录敏感站点。

如果 Stash 日志出现 `couldn't find ip`，优先检查本地 DNS 与 Fake IP 设置。DNS 策略和私有 nameserver 不并入公开主入口。

### Mihomo / Clash Party

Clash Party 推荐使用内置 `Sub-Store`：

1. 在内置 `Sub-Store` 中导入原始订阅。
2. 输出 Clash.Meta / Mihomo 节点订阅并导入客户端。
3. 在“覆写”中引用：

   ```text
   https://raw.githubusercontent.com/ZacBi/Rules/master/dist/mihomo/clash-party.js
   ```

其它 Mihomo 客户端如果支持 JavaScript 覆写，可引用：

```text
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/mihomo/override.js
```

只支持 YAML 订阅的客户端不能直接消费本仓库的 JS 覆写，需要由私有工具先合成最终 YAML 配置。

### Surge

Surge 推荐使用 detached profile，把私有节点源和公开策略片段分开。`[Proxy]` 保留在你的私有 profile 或私有远程片段中，公开部分只引用策略组和规则：

```ini
[Proxy Group]
#!include https://raw.githubusercontent.com/ZacBi/Rules/master/dist/surge/proxy-groups.compact.dconf

[Rule]
#!include https://raw.githubusercontent.com/ZacBi/Rules/master/dist/surge/rules.dconf
```

如果希望完整展示所有业务组和地区组，把 `proxy-groups.compact.dconf` 换成 `proxy-groups.dconf`。

`dist/surge/module.sgmodule` 适合承接 module 形态的 rewrite、script、MITM 能力；主策略组和分流规则优先使用 detached profile 片段。

### Quantumult X

1. 先用 `Sub-Store` 输出 Quantumult X 可消费的节点订阅。
2. 再引用轻量入口：

   ```text
   https://raw.githubusercontent.com/ZacBi/Rules/master/dist/quantumultx/rules.conf
   ```

默认入口保留空的节点、rewrite、task、backend、MITM section，只负责公开安全的策略组和分流规则。

Quantumult X 专属增强组：

- `香港优先`：`available` 策略，按香港节点正则选择首个可用节点。
- `媒体轮询`：`round-robin` 策略，按媒体常用地区节点轮询连接，适合流媒体流量；不默认用于金融或登录敏感站点。

如需在 Quantumult X 内启用 Sub-Store 运行时能力，可另行引用：

```text
https://raw.githubusercontent.com/ZacBi/Rules/master/dist/quantumultx/sub-store.conf
```

该 addon 只引用 Sub-Store 官方 Quantumult X rewrite 和 task 资源，不包含个人订阅地址。

## 策略模型

仓库使用三层模型：

- `base`：基础策略能力，例如健康检查、地区识别、通用分组、基础分流、运行时能力元数据。
- `scenario`：业务场景，例如 AI、Claude、媒体、开发工具、即时通讯、游戏平台、金融网站、国内直连、广告拦截。
- `client`：客户端适配层，把统一模型渲染为 Stash、Mihomo、Surge、Quantumult X 产物。

金融相关策略只在客户端显示通用 `金融网站` 策略组。`Longbridge`、`IBKR` 等细分站点作为本仓小型 ruleset 维护，`TigerFintech` 使用 `blackmatrix7/ios_rule_script` 的现成券商专项 ruleset，命中后统一进入 `金融网站`。具体站点优先使用小规模精准规则，不把 `Global`、`ChinaMax` 这类宽泛大规则集塞进单一业务组。

## 运行时能力

当前能力矩阵：

| 能力 | Stash | Surge | Mihomo / Clash Party | Quantumult X |
| --- | --- | --- | --- | --- |
| Rewrite | Full | Full | Unsupported | Metadata only |
| Script | Full | Full | Unsupported | Metadata only |
| MITM | Full | Full | Unsupported | Metadata only |

含义：

- `Full`：客户端可以消费对应能力。
- `Unsupported`：客户端入口不伪造该能力。
- `Metadata only`：模块索引保留元数据，公开入口不默认渲染完整运行时能力。

默认公开入口只启用低数量、低风险的运行时规则。宽泛 URL rewrite、TLS MITM、私有解锁脚本和面板脚本应保持本地化、可选化。

## 构建与验证

仓库无额外依赖，使用 Node.js 即可：

```bash
node scripts/build.js
```

构建会刷新 `dist/` 下所有客户端入口和 `dist/modules/index.json`。

常用验证：

```bash
node scripts/validate-dist.js
node --check policy/catalog.js
node --check policy/renderers.js
node --check dist/mihomo/override.js
node --check dist/mihomo/clash-party.js
node --test
git diff --check
```

如果修改了 `policy/catalog.js`、`policy/renderers.js`、`policy/index.js` 或相关策略源，必须重新运行 `node scripts/build.js` 并提交生成后的 `dist/` 产物。

如需让 Cursor 补充规则集指向自己的 fork，可在构建时设置：

```bash
RULES_GITHUB_REPO='owner/repo' node scripts/build.js
```

未设置时，公开产物不会包含 Cursor 补充规则集。

## 维护原则

- 优先使用成熟开源规则源，例如 `blackmatrix7/ios_rule_script`。
- 优先引用远程规则集，不复制大型 ruleset 到仓库。
- 小型补充规则只在确有必要时进入公开产物。
- 客户端专属能力必须显式建模，不伪装成通用能力。
- 客户端策略组数量不需要机械对齐；差异应来自各端原生能力，例如 Stash 的 `fallback/load-balance`、Quantumult X 的 `available/round-robin`、Surge 的 detached profile 片段。
- 公开文档不写个人订阅、token、Cookie、本机路径或私有验证材料。
- 宽泛规则集不能挂到具体业务组；业务组应使用精准域名或成熟上游专项规则。

## 目录

```text
policy/    # 统一策略模型与渲染器
dist/      # 构建产物：模块索引 + 客户端入口
scripts/   # 构建与校验脚本
rules/     # 小型补充列表
```

## 迁移说明

以下旧入口已废弃，不再作为主产物维护：

- `mihomo/mihomo-public.yaml`
- `surge/surge-public.conf`
- `mihomo/stash/stash-subscription-only.stoverride.yaml`

旧模式是“公开仓库生成完整配置再替换订阅”。当前模式是“先在客户端或前置工具解决订阅和节点，再引用 `dist/` 下的公开策略入口”。
