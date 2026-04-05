# Rules

面向 **Clash Mi**、**Clash Party（Mihomo）** 与 **Surge** 的代理配置模板：共享分组、地区与 Blackmatrix7 规则集映射，由 `scripts/build.js` 生成各客户端产物。本仓库为 **公开仓库**，不含真实订阅 URL；私有值请放在本地或私有副本中。许可证：[LICENSE](LICENSE)（MIT）。

依赖：本机安装 **Node.js**（用于运行生成脚本）。无需 npm 安装依赖。

---

## 已实现内容

| 能力 | 说明 |
| --- | --- |
| 共享定义 | `shared/groups.js`、`regions.js`、`rulesets.js`、`programmerRules.js` 统一驱动 Mihomo / Surge |
| Mihomo | `mihomo-public.yaml`、`mihomo-private.example.yaml`、Clash Party 用 `overwrite.js`（由 build 自共享定义生成） |
| Surge | `surge-public.conf`、`surge-private.example.conf`、`surge-local-overrides.example.conf`；`RULE-SET,LAN`、远程集 `extended-matching`、`enhanced-mode-by-rule`、Smart / `#!REQUIREMENT` 等与模板注释一致 |
| 订阅转 Surge | `scripts/airport-subscribe-to-surge-policy-list.js`（Base64 中 `anytls://`）、`scripts/surge-inject-policy-path.js`（含 `--absolute`） |
| 规则集来源 | 默认 Blackmatrix7；**Cursor** 规则集为本仓库 `mihomo/ruleset/Cursor.{yaml,list}`，raw 地址由构建时的 `RULES_GITHUB_REPO` 决定 |
| 补充列表 | `rules/alibaba.list` 等可按需自行引用 |

地区组与业务组与 `shared/` 中定义一致（含「开发工具与镜像」「学习与研究」等）。程序员相关仅 **localhost / 回环** 写在 `programmerRules.js`，其余走 BM7 规则集。

---

## 目录结构

```text
shared/          # 分组、地区、规则集映射、回环规则
mihomo/          # 生成出的 yaml、overwrite.js、ruleset/Cursor.*
surge/           # 生成出的 .conf 与示例
scripts/
  build.js
  airport-subscribe-to-surge-policy-list.js
  surge-inject-policy-path.js
rules/           # 可选静态列表（如 alibaba.list）
.env.example     # 构建相关环境变量示例（可选复制为本地 private.env，勿提交密钥）
```

`mihomo/overwrite.js` 仅维护于 `mihomo/` 下，由 `build.js` 写入；**不存在** `scripts/overwrite.js`。

---

## 生成配置

```bash
node scripts/build.js
```

生成或更新：`mihomo/overwrite.js`、`mihomo/mihomo-public.yaml`、`mihomo/mihomo-private.example.yaml`、`surge/surge-public.conf`、`surge/surge-private.example.conf`。

Fork 后若要让配置里的 Cursor raw 链接指向你的 GitHub 仓库：

```bash
RULES_GITHUB_REPO='owner/repo' node scripts/build.js
```

未设置时为占位 `YOUR_GITHUB_USER/Rules`，使用前请替换并重新生成。

本地一次性生成带占位订阅的私有文件（勿提交）：

```bash
MIHOMO_SUBSCRIPTION_URL='https://example.com/your-private-airport-subscription' \
SURGE_POLICY_PATH='https://example.com/your-private-surge-policy.list' \
node scripts/build.js
```

可得到 `mihomo/mihomo-private.yaml`、`surge/surge-private.conf`（默认已在 [.gitignore](.gitignore) 中忽略）。

---

## 规则集一览（Blackmatrix7 + 本仓 Cursor）

与 `shared/rulesets.js` 一致，主要包括：

Advertising，OpenAI，Claude，Anthropic，Gemini，Copilot，**Cursor（本仓托管）**，YouTube，Netflix，Spotify，TikTok，GlobalMedia，GitHub，Npmjs / Docker / Python / GitLab，Scholar / Wikipedia / Stackexchange，Google，Telegram，Discord，Twitter，Microsoft，Apple，Steam，Epic，ChinaMax（域名），ChinaMedia，Lan。

---

## Clash Party

导入机场订阅后，将覆写脚本指向 [mihomo/overwrite.js](mihomo/overwrite.js)。覆写会按节点名正则挂地区组、注入业务组与 BM7 `rule-providers` 及规则顺序。对外分享时只引用本仓库脚本地址即可，勿公开个人订阅链接。

---

## Clash Mi

1. 以 [mihomo/mihomo-public.yaml](mihomo/mihomo-public.yaml) 为入口模板。  
2. 复制 [mihomo/mihomo-private.example.yaml](mihomo/mihomo-private.example.yaml) 为本地 `mihomo/mihomo-private.yaml`（或他名），将 `__MIHOMO_SUBSCRIPTION_URL__` 换成你的订阅。  
3. 仅在本地或私有环境保存该文件并导入客户端。

多数机场返回 **Base64** 订阅体；Mihomo `type: http` 的 `proxy-providers` 会按标准订阅解析，模板侧无需额外解码。若商要求特定 `User-Agent` 或 `Cookie`，在私有 yaml 里为对应 `proxy-providers` 增加 `header` 等即可。

---

## Surge

入口：[surge/surge-public.conf](surge/surge-public.conf)，占位符 `__SURGE_POLICY_PATH__`。完整示例流程见 [surge/surge-private.example.conf](surge/surge-private.example.conf)。

- **已有 Surge 策略列表 URL 或本地路径**：在私有副本中替换占位符后导入。  
- **仅有与 Mihomo 类似的 Base64 订阅且主要为 `anytls://`**：在本机执行（输出文件勿提交）：

```bash
node scripts/airport-subscribe-to-surge-policy-list.js --url 'https://…' > surge/airport-surge-policies.txt
node scripts/surge-inject-policy-path.js --absolute surge/airport-surge-policies.txt < surge/surge-public.conf > surge/surge-private.local.conf
```

脚本默认浏览器 UA；`--user-agent-clash` 仅在你会自行处理 YAML→Surge 时使用。含 `ss://` / `vmess://` 等需 subconverter 或自行扩展脚本。Surge AnyTLS 版本要求见脚本注释与 [Surge 手册](https://manual.nssurge.com/policy/proxy.html)。

**与 Mihomo 的差异**：`policy-path` 需要 **Surge 语法策略列表**，不能直接把常见 Clash Base64 订阅 URL 当作 `policy-path`。

**模板内可选能力**（详见生成文件内注释）：`enhanced-mode-by-rule`、Smart / `url-test` 与 `#!REQUIREMENT`、`[Host]` 示例、`external-controller` 示例、[surge-local-overrides.example.conf](surge/surge-local-overrides.example.conf) 的 `#!include` 叠规则。

---

## 本地与私有文件

订阅、本地策略列表、`*.local.*`、`.env*`、客户端下载的 `mihomo/ruleset/*`（除已提交的 Cursor 文件）等见 [.gitignore](.gitignore)。修改 `shared/` 后请重新执行 `node scripts/build.js`。

---

## 可选扩展（未承诺排期）

- 更细的地区优先级或正则策略  
- 额外国内 / 自定义规则集接入方式  
- Surge Module 形态交付  

若你改进本仓库，欢迎通过 Issue / PR 交流；也欢迎直接 Fork 按 `RULES_GITHUB_REPO` 与本地副本定制。
