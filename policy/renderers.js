"use strict";

function uniq(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function yamlScalar(value) {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(String(value));
}

function renderRuleProviderBlock(ruleSet) {
  return [
    `  ${ruleSet.id}:`,
    "    type: http",
    `    behavior: ${ruleSet.behavior}`,
    `    url: ${yamlScalar(ruleSet.urls.mihomo)}`,
    `    path: ${yamlScalar(ruleSet.paths.mihomo)}`,
    "    interval: 86400",
  ].join("\n");
}

function runtimeModulesByKind(index, kind, options = {}) {
  return (index.runtimeModules || [])
    .filter((module) => module.kind === kind)
    .filter((module) => !options.defaultOnly || module.emitByDefault !== false);
}

const QURE_ICON_BASE_URL = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color";
const QURE_ICON_CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";
const LOBE_ICON_BASE_URL = "https://unpkg.com/@lobehub/icons-static-png@1.91.0/light";
const LOBE_ICON_CDN_BASE_URL = "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png@1.91.0/light";
const TWEMOJI_ICON_BASE_URL = "https://raw.githubusercontent.com/jdecked/twemoji/main/assets/72x72";
const TWEMOJI_ICON_CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@main/assets/72x72";
const NOISE_POLICY_PATTERN = "剩余|流量|到期|过期|套餐|官网|订阅|更新|重置|用户|倍率|余额|Traffic|Expire|Expiry|Subscription|Reset";
const RESERVED_POLICY_PATTERN = "全部节点|自动选择|节点选择|DIRECT|REJECT";
const QUANTUMULTX_RESOURCE_UPDATE_INTERVAL = 172800;
const ICON_URL_BY_GROUP = {
  Claude: `${LOBE_ICON_BASE_URL}/claude-color.png`,
  金融网站: `${TWEMOJI_ICON_BASE_URL}/1f3e6.png`,
};
const STASH_ICON_FILENAME_BY_GROUP = {
  全部节点: "Server.png",
  自动选择: "Speedtest.png",
  节点选择: "Auto.png",
  香港节点: "Hong_Kong.png",
  台湾节点: "Taiwan.png",
  日本节点: "Japan.png",
  新加坡节点: "Singapore.png",
  美国节点: "United_States_Map.png",
  英国节点: "United_Kingdom.png",
  澳洲节点: "Australia.png",
  马来西亚节点: "Malaysia.png",
  阿根廷节点: "Argentina.png",
  国外媒体: "ForeignMedia.png",
  AI平台: "ChatGPT.png",
  即时通讯: "Telegram.png",
  微软服务: "Microsoft.png",
  苹果服务: "Apple_2.png",
  游戏平台: "Game.png",
  香港优先: "Hong_Kong.png",
  媒体负载均衡: "Media.png",
  媒体轮询: "Media.png",
  国外网站: "Global.png",
  国内网站: "China_Map.png",
  字节跳动: "TikTok.png",
  广告拦截: "Advertising.png",
  漏网之鱼: "Rocket.png",
};

function toStashGroupName(name) {
  return name;
}

function stashGroupIcon(name) {
  if (ICON_URL_BY_GROUP[name]) {
    return ICON_URL_BY_GROUP[name];
  }
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_BASE_URL}/${fileName}` : null;
}

function quantumultxPolicyIcon(name) {
  if (name === "Claude") {
    return `${LOBE_ICON_CDN_BASE_URL}/claude-color.png`;
  }
  if (name === "金融网站") {
    return `${TWEMOJI_ICON_CDN_BASE_URL}/1f3e6.png`;
  }
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_CDN_BASE_URL}/${fileName}` : null;
}

function stashPolicyFilter(match = null) {
  const clauses = [`(?!.*(${NOISE_POLICY_PATTERN}))`];
  if (match) {
    clauses.push(`(?=.*(${match}))`);
  }
  return `(?i)^${clauses.join("")}.*$`;
}

function surgePolicyFilter(match = null) {
  const clauses = [
    `(?!(?:${RESERVED_POLICY_PATTERN})$)`,
    `(?!.*(?:${NOISE_POLICY_PATTERN}))`,
  ];
  if (match) {
    clauses.push(`(?=.*(?:${match}))`);
  }
  return `^${clauses.join("")}.*$`;
}

function quantumultxPolicyFilter(match = null) {
  const clauses = [`(?!.*(${NOISE_POLICY_PATTERN}))`];
  if (match) {
    clauses.push(`(?=.*(${match}))`);
  }
  return `^${clauses.join("")}.*$`;
}

function renderStashGroupHeader(name, type) {
  const lines = [
    `  - name: ${yamlScalar(toStashGroupName(name))}`,
    `    type: ${type}`,
  ];
  const icon = stashGroupIcon(name);
  if (icon) {
    lines.push(`    icon: ${yamlScalar(icon)}`);
  }
  return lines;
}

function applyStashPolicyChoices(proxies, choicesConfig) {
  if (!choicesConfig) {
    return proxies;
  }
  if (Array.isArray(choicesConfig)) {
    return [...choicesConfig, ...proxies];
  }

  const choices = choicesConfig.choices || [];
  if (!choices.length) {
    return proxies;
  }
  if (!choicesConfig.after) {
    return [...choices, ...proxies];
  }

  const result = [];
  for (const proxy of proxies) {
    result.push(proxy);
    if (proxy === choicesConfig.after) {
      result.push(...choices);
    }
  }
  if (!proxies.includes(choicesConfig.after)) {
    result.unshift(...choices);
  }
  return result;
}

function renderStashStrategyGroup(index, group) {
  const healthCheck = index.defaultHealthCheck;
  const lines = renderStashGroupHeader(group.name, group.type);
  const choicesConfig = index.stashPolicyChoices && index.stashPolicyChoices[group.name];

  if (group.mode === "all-proxies") {
    lines.push("    include-all: true", `    filter: ${yamlScalar(stashPolicyFilter())}`);
    if (group.type !== "select") {
      lines.push(
        `    url: ${yamlScalar(healthCheck.url)}`,
        `    interval: ${healthCheck.interval}`,
        `    tolerance: ${healthCheck.tolerance}`,
        "    lazy: true"
      );
    }
    return lines.join("\n");
  }

  lines.push(
    "    proxies:",
    ...uniq(applyStashPolicyChoices(group.proxies, choicesConfig)).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`)
  );
  return lines.join("\n");
}

function renderStashRegionGroup(index, region) {
  const healthCheck = index.defaultHealthCheck;
  return [
    ...renderStashGroupHeader(region.groupName, "url-test"),
    "    include-all: true",
    `    filter: ${yamlScalar(stashPolicyFilter(region.match))}`,
    `    url: ${yamlScalar(healthCheck.url)}`,
    `    interval: ${healthCheck.interval}`,
    `    tolerance: ${healthCheck.tolerance}`,
    "    lazy: true",
  ].join("\n");
}

function renderStashServiceCheckGroup(group) {
  return [
    ...renderStashGroupHeader(group.name, group.type),
    "    proxies:",
    ...uniq(group.proxies).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`),
    `    url: ${yamlScalar(group.url)}`,
    `    interval: ${group.interval}`,
    `    tolerance: ${group.tolerance}`,
    "    lazy: true",
  ].join("\n");
}

function renderStashEnhancementGroup(index, group) {
  const healthCheck = index.defaultHealthCheck;
  const lines = [
    ...renderStashGroupHeader(group.name, group.type),
    "    include-all: true",
    `    filter: ${yamlScalar(stashPolicyFilter(group.match))}`,
    `    url: ${yamlScalar(healthCheck.url)}`,
    `    interval: ${healthCheck.interval}`,
    `    tolerance: ${healthCheck.tolerance}`,
    "    lazy: true",
  ];

  if (group.strategy) {
    lines.push(`    strategy: ${group.strategy}`);
  }
  if (group.hidden) {
    lines.push("    hidden: true");
  }

  return lines.join("\n");
}

function renderStashBusinessGroup(index, group) {
  const choicesConfig = index.stashPolicyChoices && index.stashPolicyChoices[group.name];
  return [
    ...renderStashGroupHeader(group.name, "select"),
    "    proxies:",
    ...uniq(applyStashPolicyChoices(group.proxies, choicesConfig)).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`),
  ].join("\n");
}

function renderRouteRule(rule, groupName) {
  return `${rule},${groupName}`;
}

function renderStashHttpRuntimeBlocks(rewriteModules, scriptModules, mitmModules) {
  const lines = [];
  const mitmHostnames = uniq(
    (mitmModules || [])
      .flatMap((module) => (module.render && module.render.hostnames) || [])
      .filter(Boolean)
  );

  if (!rewriteModules.length && !scriptModules.length && !mitmHostnames.length) {
    return lines;
  }

  lines.push("", "http:");

  if (rewriteModules.length) {
    lines.push(
      "  url-rewrite:",
      ...rewriteModules.flatMap((rewrite) => [
        `    # ${rewrite.title}`,
        ...rewrite.lines.map((line) => `    - ${yamlScalar(line)}`),
      ])
    );
  }

  if (scriptModules.length) {
    lines.push(
      "  script:",
      ...scriptModules.flatMap((script) => [
        "    - " + `match: ${yamlScalar(script.match)}`,
        `      name: ${yamlScalar(script.name)}`,
        `      type: ${script.type}`,
        `      require-body: ${Boolean(script.requireBody)}`,
        `      timeout: ${script.timeout || 5}`,
        `      argument: ${yamlScalar(script.argument || "")}`,
        `      binary-mode: ${Boolean(script.binaryMode)}`,
        `      max-size: ${script.maxSize || 1048576}`,
      ])
    );
  }

  if (mitmHostnames.length) {
    lines.push(
      "  mitm:",
      ...mitmHostnames.map((hostname) => `    - ${yamlScalar(hostname)}`)
    );
  }

  if (scriptModules.length) {
    lines.push(
      "",
      "script-providers:",
      ...scriptModules.flatMap((script) => [
        `  ${script.name}:`,
        `    url: ${yamlScalar(script.url)}`,
        "    interval: 86400",
      ])
    );
  }

  return lines;
}

function renderStashEntry(index) {
  const rewriteModules = runtimeModulesByKind(index, "rewrite", { defaultOnly: true })
    .map((module) =>
      module.render && module.render.stashRewrite
        ? { title: module.title, lines: Array.isArray(module.render.stashRewrite) ? module.render.stashRewrite : [module.render.stashRewrite] }
        : null
    )
    .filter(Boolean);
  const scriptModules = runtimeModulesByKind(index, "script", { defaultOnly: true })
    .map((module) => module.render && module.render.stashScript)
    .filter(Boolean);
  const mitmModules = (index.runtimeModules || [])
    .filter((module) => module.emitByDefault !== false)
    .filter((module) => module.render && module.render.hostnames);
  const lines = [
    "# Generated from the unified strategy model",
    "name: Rules 策略分流",
    "desc: Stash iOS 轻量策略组与规则集入口。",
    "homepage: https://github.com/ZacBi/Rules",
    "author: Rules contributors",
    "category: Policy",
    `icon: ${yamlScalar(`${QURE_ICON_BASE_URL}/Policy.png`)}`,
    "proxy-groups: #!replace",
    ...index.strategyGroups.map((group) => renderStashStrategyGroup(index, group)),
    ...index.serviceCheckGroups.map((group) => renderStashServiceCheckGroup(group)),
    ...index.stashEnhancementGroups.map((group) => renderStashEnhancementGroup(index, group)),
    ...index.businessGroups.map((group) => renderStashBusinessGroup(index, group)),
    ...index.regions.map((region) => renderStashRegionGroup(index, region)),
    "",
    "rule-providers: #!replace",
    ...index.ruleSets.map((ruleSet) => renderRuleProviderBlock(ruleSet)),
    "",
    "rules: #!replace",
    ...index.clashInlineRules.map((rule) => `  - ${yamlScalar(rule)}`),
    ...index.inlineRules.map((rule) => `  - ${yamlScalar(rule)}`),
    ...index.routingRules.map((route) => `  - ${yamlScalar(renderRouteRule(route.rule, toStashGroupName(route.group)))}`),
    ...index.ruleSets.map((ruleSet) => `  - ${yamlScalar(`RULE-SET,${ruleSet.id},${toStashGroupName(ruleSet.group)}`)}`),
    `  - ${yamlScalar(`MATCH,${toStashGroupName("漏网之鱼")}`)}`,
  ];

  lines.push(...renderStashHttpRuntimeBlocks(rewriteModules, scriptModules, mitmModules));

  return lines.join("\n");
}

function renderMihomoEntry(index, options = {}) {
  const { commonJs = true } = options;
  const groupsSource = [
    "  const defaultUrl = MODULE_INDEX.defaultHealthCheck.url;",
    "  const defaultInterval = MODULE_INDEX.defaultHealthCheck.interval;",
    "  const defaultTolerance = MODULE_INDEX.defaultHealthCheck.tolerance;",
    `  const noisePattern = new RegExp(${JSON.stringify(NOISE_POLICY_PATTERN)}, "i");`,
    "",
    "  function buildProxyNames(config) {",
    "    return uniq((config.proxies || []).map((proxy) => proxy && proxy.name)).filter((name) => !noisePattern.test(name));",
    "  }",
    "",
    "  function buildRegionGroups(proxyNames) {",
    "    return MODULE_INDEX.regions.map((region) => {",
    "      const matched = proxyNames.filter((name) => new RegExp(region.match, \"i\").test(name));",
    "      return {",
    "        name: region.groupName,",
    "        type: \"url-test\",",
    "        hidden: true,",
    "        proxies: matched.length ? uniq(matched) : [\"自动选择\"],",
    "        url: defaultUrl,",
    "        interval: defaultInterval,",
    "        tolerance: defaultTolerance,",
    "      };",
    "    });",
    "  }",
    "",
    "  function buildStrategyGroups(proxyNames) {",
    "    return MODULE_INDEX.strategyGroups.map((group) => {",
    "      if (group.mode === \"all-proxies\") {",
    "        const generated = {",
    "          name: group.name,",
    "          type: group.type,",
    "          proxies: proxyNames.length ? uniq(proxyNames) : [\"DIRECT\"],",
    "        };",
    "        if (group.type !== \"select\") {",
    "          generated.url = defaultUrl;",
    "          generated.interval = defaultInterval;",
    "          generated.tolerance = defaultTolerance;",
    "        }",
    "        return generated;",
    "      }",
    "",
    "      return {",
    "        name: group.name,",
    "        type: group.type,",
    "        proxies: uniq(group.proxies),",
    "      };",
    "    });",
    "  }",
    "",
    "  function buildEnhancementGroups(proxyNames) {",
    "    return MODULE_INDEX.stashEnhancementGroups.map((group) => {",
    "      const matched = proxyNames.filter((name) => new RegExp(group.match, \"i\").test(name));",
    "      const generated = {",
    "        name: group.name,",
    "        type: group.type,",
    "        proxies: matched.length ? uniq(matched) : [\"自动选择\"],",
    "        url: defaultUrl,",
    "        interval: defaultInterval,",
    "        tolerance: defaultTolerance,",
    "      };",
    "      if (group.strategy) {",
    "        generated.strategy = group.strategy;",
    "      }",
    "      if (group.hidden) {",
    "        generated.hidden = true;",
    "      }",
    "      return generated;",
    "    });",
    "  }",
    "",
    "  function buildServiceCheckGroups() {",
    "    return MODULE_INDEX.serviceCheckGroups.map((group) => ({",
    "      name: group.name,",
    "      type: group.type,",
    "      proxies: uniq(group.proxies),",
    "      url: group.url,",
    "      interval: group.interval,",
    "      tolerance: group.tolerance,",
    "    }));",
    "  }",
    "",
    "  function buildBusinessGroups() {",
    "    return MODULE_INDEX.businessGroups.map((group) => {",
    "      const choicesConfig = MODULE_INDEX.stashPolicyChoices[group.name];",
    "      const choices = Array.isArray(choicesConfig)",
    "        ? choicesConfig",
    "        : ((choicesConfig && choicesConfig.choices) || []);",
    "      const proxies = [...group.proxies];",
    "      if (choices.length && choicesConfig && choicesConfig.after) {",
    "        const afterIndex = proxies.indexOf(choicesConfig.after);",
    "        if (afterIndex >= 0) {",
    "          proxies.splice(afterIndex + 1, 0, ...choices);",
    "        } else {",
    "          proxies.unshift(...choices);",
    "        }",
    "      } else {",
    "        proxies.unshift(...choices);",
    "      }",
    "      return {",
    "        name: group.name,",
    "        type: group.type,",
    "        proxies: uniq(proxies),",
    "      };",
    "    });",
    "  }",
    "",
    "  function buildRuleProviders() {",
    "    return MODULE_INDEX.ruleSets.reduce((providers, ruleSet) => {",
    "      providers[ruleSet.id] = {",
    "        type: \"http\",",
    "        behavior: ruleSet.behavior,",
    "        url: ruleSet.urls.mihomo,",
    "        path: ruleSet.paths.mihomo,",
    "        interval: 86400,",
    "      };",
    "      return providers;",
    "    }, {});",
    "  }",
    "",
    "  function buildRules() {",
    "    return [",
    "      ...MODULE_INDEX.clashInlineRules,",
    "      ...MODULE_INDEX.inlineRules,",
    "      ...MODULE_INDEX.routingRules.map((route) => `${route.rule},${route.group}`),",
    "      ...MODULE_INDEX.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.id},${ruleSet.group}`),",
    "      \"MATCH,漏网之鱼\",",
    "    ];",
    "  }",
  ].join("\n");

  const lines = [
    `const MODULE_INDEX = ${JSON.stringify(index, null, 2)};`,
    "",
    "function uniq(items) {",
    "  return [...new Set((items || []).filter(Boolean))];",
    "}",
    "",
    "function main(config = {}) {",
    "  config.proxies ??= [];",
    "  config[\"proxy-groups\"] ??= [];",
    "  config[\"rule-providers\"] ??= {};",
    "  config.rules ??= [];",
    "",
    groupsSource,
    "",
    "  const proxyNames = buildProxyNames(config);",
    "  config[\"proxy-groups\"] = [",
    "    ...buildStrategyGroups(proxyNames),",
    "    ...buildServiceCheckGroups(),",
    "    ...buildEnhancementGroups(proxyNames),",
    "    ...buildRegionGroups(proxyNames),",
    "    ...buildBusinessGroups(),",
    "  ];",
    "  config[\"rule-providers\"] = buildRuleProviders();",
    "  config.rules = buildRules();",
    "  config[\"x-runtime-support\"] = MODULE_INDEX.runtimeSupportMatrix;",
    "  return config;",
    "}",
  ];

  if (commonJs) {
    lines.push(
      "",
      "if (typeof module !== \"undefined\" && module.exports) {",
      "  module.exports = {",
      "    main,",
      "    MODULE_INDEX,",
      "  };",
      "}"
    );
  }

  return lines.join("\n");
}

function renderClashPartyEntry(index) {
  return renderMihomoEntry(index, { commonJs: false });
}

function renderSurgeStrategyGroup(group, healthCheck, allPolicyRegex) {
  if (group.mode === "all-proxies") {
    const line = `${group.name} = ${group.type}, include-all-proxies=true, policy-regex-filter='${allPolicyRegex}'`;
    if (group.type === "select") {
      return line;
    }
    return `${line}, url=${healthCheck.url}, interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, timeout=${healthCheck.timeout}`;
  }

  return `${group.name} = ${group.type}, ${uniq(group.proxies).join(", ")}`;
}

const compactSurgeHiddenGroups = new Set([
  "全部节点",
  "自动选择",
  "国外媒体",
  "即时通讯",
  "微软服务",
  "苹果服务",
  "游戏平台",
  "国内网站",
  "广告拦截",
]);

function hideSurgePolicyGroup(line, hidden) {
  return hidden ? `${line}, hidden=true` : line;
}

function surgePolicyIcon(name) {
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_BASE_URL}/${fileName}` : null;
}

function renderSurgeProxyGroups(index, { compact = false } = {}) {
  const healthCheck = index.defaultHealthCheck;
  const allPolicyRegex = surgePolicyFilter();
  const hiddenGroups = compact ? compactSurgeHiddenGroups : new Set();
  return [
    "[Proxy Group]",
    ...index.strategyGroups.map((group) =>
      hideSurgePolicyGroup(renderSurgeStrategyGroup(group, healthCheck, allPolicyRegex), hiddenGroups.has(group.name))
    ),
    ...index.serviceCheckGroups.map((group) =>
      hideSurgePolicyGroup(
        `${group.name} = url-test, ${uniq(group.proxies).join(", ")}, url=${group.url}, interval=${group.interval}, tolerance=${group.tolerance}, timeout=${group.timeout}`,
        hiddenGroups.has(group.name)
      )
    ),
    ...index.regions.map((region) =>
      hideSurgePolicyGroup(
        `${region.groupName} = url-test, include-all-proxies=true, policy-regex-filter='${surgePolicyFilter(region.match)}', url=${healthCheck.url}, interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, timeout=${healthCheck.timeout}`,
        compact
      )
    ),
    ...index.businessGroups.map((group) => {
      const icon = surgePolicyIcon(group.name);
      const line = `${group.name} = select, ${uniq(group.proxies).join(", ")}${icon ? `, icon-url=${icon}` : ""}`;
      return hideSurgePolicyGroup(line, hiddenGroups.has(group.name));
    }),
  ].join("\n");
}

function renderSurgeRules(index) {
  return [
    "[Rule]",
    "RULE-SET,LAN,DIRECT",
    ...index.inlineRules,
    ...index.routingRules.map((route) => renderRouteRule(route.rule, route.group)),
    ...index.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.urls.surge},${ruleSet.group},extended-matching`),
    "FINAL,漏网之鱼",
  ].join("\n");
}

function renderSurgeEntry(index) {
  const rewriteModules = runtimeModulesByKind(index, "rewrite", { defaultOnly: true })
    .map((module) =>
      module.render && module.render.surgeRewrite
        ? { title: module.title, line: module.render.surgeRewrite }
        : null
    )
    .filter(Boolean);
  const scriptModules = runtimeModulesByKind(index, "script", { defaultOnly: true })
    .map((module) => module.render && module.render.surgeScript)
    .filter(Boolean);
  const mitmHostnames = uniq(
    runtimeModulesByKind(index, "mitm", { defaultOnly: true })
      .flatMap((module) => (module.render && module.render.hostnames) || [])
      .filter(Boolean)
  );
  const lines = [
    "#!name=Rules",
    "#!desc=Unified Surge strategy module. Use with a profile that already provides proxy nodes.",
    "#!category=Rules",
    "#!author=ZacBi",
    "#!homepage=https://github.com/ZacBi/Rules",
    "",
    "# Generated from the unified strategy model",
    "# The module is designed to be included on top of a profile that already resolves subscription parsing upstream.",
    "# No policy-path placeholder is used here.",
    "",
    renderSurgeProxyGroups(index),
    "",
    renderSurgeRules(index),
  ];

  if (rewriteModules.length) {
    lines.push("", "[URL Rewrite]", ...rewriteModules.flatMap((rewrite) => [`# ${rewrite.title}`, rewrite.line]));
  }

  if (scriptModules.length) {
    lines.push(
      "",
      "[Script]",
      ...scriptModules.map(
        (script) =>
          `${script.name} = type=${script.type}, pattern=${script.pattern}, script-path=${script.url}, timeout=10`
      )
    );
  }

  if (mitmHostnames.length) {
    lines.push("", "[MITM]", `hostname = %APPEND% ${mitmHostnames.join(", ")}`);
  }

  return lines.join("\n");
}

function toQuantumultxPolicyName(name) {
  if (name === "DIRECT") {
    return "direct";
  }
  if (name === "REJECT") {
    return "reject";
  }
  return name;
}

function withQuantumultxPolicyIcon(line, name) {
  const icon = quantumultxPolicyIcon(name);
  return icon ? `${line}, img-url=${icon}` : line;
}

function renderQuantumultxPolicyGroup(group, index) {
  const healthCheck = index.defaultHealthCheck;
  const extraChoices = (index.quantumultxPolicyChoices && index.quantumultxPolicyChoices[group.name]) || [];
  if (group.mode === "all-proxies") {
    const filter = quantumultxPolicyFilter();
    if (group.type === "url-test") {
      return withQuantumultxPolicyIcon(
        `url-latency-benchmark=${group.name}, server-tag-regex=${filter}, check-interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, alive-checking=false`,
        group.name
      );
    }
    return withQuantumultxPolicyIcon(`static=${group.name}, server-tag-regex=${filter}`, group.name);
  }

  return withQuantumultxPolicyIcon(
    `static=${group.name}, ${uniq([...extraChoices, ...group.proxies]).map(toQuantumultxPolicyName).join(", ")}`,
    group.name
  );
}

function renderQuantumultxEnhancementGroup(group) {
  return withQuantumultxPolicyIcon(
    `${group.type}=${group.name}, server-tag-regex=${quantumultxPolicyFilter(group.match)}`,
    group.name
  );
}

function renderQuantumultxRegionGroup(region, index) {
  const healthCheck = index.defaultHealthCheck;
  return withQuantumultxPolicyIcon(
    `url-latency-benchmark=${region.groupName}, server-tag-regex=${quantumultxPolicyFilter(region.match)}, check-interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, alive-checking=false`,
    region.groupName
  );
}

function renderQuantumultxServiceCheckGroup(group) {
  const type = group.type === "url-test" ? "url-latency-benchmark" : group.type;
  return withQuantumultxPolicyIcon(
    `${type}=${group.name}, ${uniq(group.proxies).map(toQuantumultxPolicyName).join(", ")}, check-interval=${group.interval}, tolerance=${group.tolerance}`,
    group.name
  );
}

function renderQuantumultxBusinessGroup(index, group) {
  const extraChoices = (index.quantumultxPolicyChoices && index.quantumultxPolicyChoices[group.name]) || [];
  return withQuantumultxPolicyIcon(
    `static=${group.name}, ${uniq([...extraChoices, ...group.proxies]).map(toQuantumultxPolicyName).join(", ")}`,
    group.name
  );
}

// Quantumult X 的域名规则名与 Clash 不同，不能只做大小写转换。
function toQuantumultxRuleType(type) {
  const mappedTypes = {
    DOMAIN: "host",
    "DOMAIN-SUFFIX": "host-suffix",
    "DOMAIN-KEYWORD": "host-keyword",
    "IP-CIDR6": "ip6-cidr",
  };
  return mappedTypes[type] || type.toLowerCase();
}

function renderQuantumultxRouteRule(rule, groupName) {
  const parts = rule.split(",");
  parts[0] = toQuantumultxRuleType(parts[0]);
  return `${parts.join(",")},${toQuantumultxPolicyName(groupName)}`;
}

function renderQuantumultxInlineRule(rule) {
  const parts = rule.split(",");
  if (parts.length < 3) {
    return rule;
  }
  const policyIndex = parts[parts.length - 1] === "no-resolve" ? parts.length - 2 : parts.length - 1;
  parts[0] = toQuantumultxRuleType(parts[0]);
  parts[policyIndex] = toQuantumultxPolicyName(parts[policyIndex]);
  return parts.join(",");
}

function renderQuantumultxEntry(index) {
  const lines = [
    "; Generated from the unified strategy model",
    "; Import server subscriptions separately, then enable this policy and filter profile.",
    "",
    "[general]",
    "",
    "[dns]",
    "",
    "[policy]",
    ...index.strategyGroups.map((group) => renderQuantumultxPolicyGroup(group, index)),
    ...index.serviceCheckGroups.map((group) => renderQuantumultxServiceCheckGroup(group)),
    ...index.quantumultxEnhancementGroups.map((group) => renderQuantumultxEnhancementGroup(group)),
    ...index.regions.map((region) => renderQuantumultxRegionGroup(region, index)),
    ...index.businessGroups.map((group) => renderQuantumultxBusinessGroup(index, group)),
    "",
    "[server_remote]",
    "",
    "[filter_remote]",
    "FILTER_REGION, tag=CN, force-policy=direct, inserted-resource=true, enabled=true",
    "FILTER_LAN, tag=LAN, force-policy=direct, inserted-resource=true, enabled=true",
    ...index.ruleSets.map(
      (ruleSet) =>
        `${ruleSet.urls.quantumultx}, tag=${ruleSet.sourceName}, force-policy=${toQuantumultxPolicyName(ruleSet.group)}, update-interval=${QUANTUMULTX_RESOURCE_UPDATE_INTERVAL}, opt-parser=false, enabled=true`
    ),
    "",
    "[rewrite_remote]",
    "",
    "[server_local]",
    "",
    "[filter_local]",
    ...index.inlineRules.map((rule) => renderQuantumultxInlineRule(rule)),
    ...index.routingRules.map((route) => renderQuantumultxRouteRule(route.rule, route.group)),
    "final,漏网之鱼",
    "",
    "[rewrite_local]",
    "",
    "[task_local]",
    "",
    "[http_backend]",
    "",
    "[mitm]",
  ];

  return lines.join("\n");
}

function renderQuantumultxSubStoreAddon() {
  return [
    "; Optional Sub-Store runtime addon for Quantumult X.",
    "; Import this separately only when you want Sub-Store rewrite/task support.",
    "",
    "[rewrite_remote]",
    "https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/QX.snippet, tag=Sub-Store, update-interval=172800, opt-parser=false, enabled=true",
    "",
    "[task_local]",
    "https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/QX-Task.json, tag=Sub-Store, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Server.png, enabled=true",
  ].join("\n");
}

module.exports = {
  renderMihomoEntry,
  renderClashPartyEntry,
  renderQuantumultxEntry,
  renderQuantumultxSubStoreAddon,
  renderStashEntry,
  renderSurgeEntry,
  renderSurgeProxyGroups,
  renderSurgeRules,
};
