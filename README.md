# Rules

一个面向多客户端的代理配置仓库，统一维护共享逻辑，再分别交付给 Clash Mi、Clash Party 和 Surge。

这不是 npm 项目，也不是前端构建仓库。这里只有代理配置、共享规则定义，以及一个很薄的本地生成脚本。

## 目录结构

```text
shared/
  groups.js
  regions.js
  rulesets.js
mihomo/
  overwrite.js
  mihomo-public.yaml
  mihomo-private.example.yaml
surge/
  surge-public.conf
  surge-private.example.conf
scripts/
  build.js
  overwrite.js
rules/
  alibaba.list
```

核心原则：

- `shared/` 只放共享逻辑，包含地区节点组织、业务分组和 Blackmatrix7 规则集映射。
- `mihomo/` 放 Mihomo 系客户端入口，`overwrite.js` 给 Clash Party 用，`mihomo-public.yaml` 给 Clash Mi 或其他 Mihomo 客户端直接导入。
- `surge/` 放 Surge 独立配置入口。
- `scripts/build.js` 负责从共享定义生成各客户端首版模板。
- `scripts/overwrite.js` 是 `mihomo/overwrite.js` 的兼容镜像，方便保留旧路径。

## 支持范围

首批地区组：

- 香港
- 台湾
- 日本
- 新加坡
- 美国
- 英国
- 澳洲
- 马来西亚
- 阿根廷

首批业务组：

- 节点选择
- 自动选择
- 国外媒体
- AI平台
- 开发平台
- 即时通讯
- 微软服务
- 苹果服务
- 游戏平台
- 国外网站
- 国内网站
- 广告拦截
- 漏网之鱼

首批 Mihomo / Surge 规则集映射全部优先使用 Blackmatrix7，当前已覆盖：

- Advertising
- OpenAI
- Claude
- Gemini
- Copilot
- YouTube
- Netflix
- Spotify
- TikTok
- GlobalMedia
- GitHub
- Google
- Telegram
- Discord
- Twitter
- Microsoft
- Apple
- Steam
- Epic
- China
- ChinaMedia
- Lan

## 生成方式

直接运行脚本即可：

```bash
node scripts/build.js
```

生成结果会直接落到目标目录：

- `mihomo/overwrite.js`
- `mihomo/mihomo-public.yaml`
- `mihomo/mihomo-private.example.yaml`
- `surge/surge-public.conf`
- `surge/surge-private.example.conf`

如果你要在本地直接生成私有配置，可以带环境变量执行：

```bash
MIHOMO_SUBSCRIPTION_URL='https://example.com/your-private-airport-subscription' \
SURGE_POLICY_PATH='https://example.com/your-private-surge-policy.list' \
node scripts/build.js
```

设置后会额外生成：

- `mihomo/mihomo-private.yaml`
- `surge/surge-private.conf`

## Clash Party 导入方式

Clash Party 支持 JavaScript 覆写。导入订阅后，把覆写脚本指向仓库里的 [mihomo/overwrite.js](/Users/zacbi/git/Rules/mihomo/overwrite.js) 即可。

建议方式：

1. 把你的机场订阅正常添加到 Clash Party。
2. 在订阅的覆写配置里绑定 `overwrite.js`。
3. 使用仓库公开地址时，只公开脚本地址，不公开真实机场订阅 URL。

`overwrite.js` 的职责：

- 保留 Mihomo / Clash Party 侧的 JS 覆写能力。
- 根据节点名称正则自动生成地区节点组。
- 注入共享业务组。
- 注入 Blackmatrix7 `rule-providers` 与规则顺序。

## Clash Mi 导入方式

Clash Mi 可以直接导入完整 Mihomo 配置。公开仓库建议使用 [mihomo/mihomo-public.yaml](/Users/zacbi/git/Rules/mihomo/mihomo-public.yaml) 作为模板入口。

使用方法：

1. 复制 [mihomo/mihomo-private.example.yaml](/Users/zacbi/git/Rules/mihomo/mihomo-private.example.yaml) 为本地私有文件，例如 `mihomo/mihomo-private.yaml`。
2. 将其中的 `__MIHOMO_SUBSCRIPTION_URL__` 或示例 URL 替换为你的真实原始订阅 URL。
3. 只在本地或私有仓库保存该私有文件，再导入 Clash Mi。

这个模板按你的约束保留了 Mihomo 的核心能力：

- 使用 `proxy-providers`
- 面向原始订阅 URL
- 兼容 Base64 形式的节点内容
- 面向 AnyTLS 节点源设计

## Surge 导入方式

Surge 使用独立配置体系，入口是 [surge/surge-public.conf](/Users/zacbi/git/Rules/surge/surge-public.conf)。

当前第一版骨架做法是：

1. 公开模板里只保留 `__SURGE_POLICY_PATH__` 占位符。
2. 你在私有环境里把它替换成 Surge 可消费的私有策略列表 URL 或本地文件路径。
3. 再导入 Surge。

也可以直接参考 [surge/surge-private.example.conf](/Users/zacbi/git/Rules/surge/surge-private.example.conf)。

说明：

- Surge 业务组和规则分流会尽量与 Mihomo 侧保持同构。
- 共享分组、地区和规则集映射仍然来自 `shared/`。
- 公开仓库不承载真实订阅 URL，也不承载私有转换入口。

## 如何保护订阅 URL

公开仓库里只放：

- 规则逻辑
- 共享分组定义
- 模板
- 占位符
- 示例文件

不要放进公开仓库的内容：

- 真实机场原始订阅 URL
- 任何可直接还原真实订阅入口的私有转换地址
- 本地私有配置文件

当前仓库已通过 [.gitignore](/Users/zacbi/git/Rules/.gitignore) 忽略以下私有文件：

- `mihomo/mihomo-private.yaml`
- `surge/surge-private.conf`
- `private.env`
- `private.env.local`

推荐做法：

1. 公开仓库只维护模板和脚本。
2. 私有值只保存在本地未跟踪文件、私有仓库或私有分支。
3. 每次修改共享逻辑后重新执行 `node scripts/build.js`，同步 Mihomo / Surge 模板。

## 当前实现说明

这一版是可运行骨架，重点是先把结构和共享逻辑定下来：

- 已把地区、业务组、Blackmatrix7 规则集映射抽到 `shared/`
- 已把 Mihomo `overwrite.js` 改成由共享定义生成
- 已生成 Clash Mi 用的公开 / 私有模板
- 已生成 Surge 用的公开模板

下一步如果你继续推进，适合补的内容是：

- 更细的地区策略优先级
- 自定义国内规则补充
- Surge module 版本
