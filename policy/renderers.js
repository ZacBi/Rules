"use strict";

function uniq(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function indentBlock(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function yamlScalar(value) {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(String(value));
}

function renderYamlListItem(value, indent = 2) {
  return `${" ".repeat(indent)}- ${yamlScalar(value)}`;
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

function runtimeModulesByKind(index, kind) {
  return (index.runtimeModules || []).filter((module) => module.kind === kind);
}

const QURE_ICON_BASE_URL = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color";
const STASH_DISPLAY_NAME_BY_GROUP = {
  自动选择: "智能优选",
  节点选择: "手动选择",
  香港节点: "香港",
  台湾节点: "台湾",
  日本节点: "日本",
  新加坡节点: "新加坡",
  美国节点: "美国",
  英国节点: "英国",
  澳洲节点: "澳洲",
  马来西亚节点: "马来西亚",
  阿根廷节点: "阿根廷",
  国外媒体: "国外媒体",
  AI平台: "AI平台",
  开发工具与镜像: "开发工具",
  学习与研究: "学习研究",
  即时通讯: "即时通讯",
  微软服务: "微软服务",
  苹果服务: "苹果服务",
  游戏平台: "游戏平台",
  国外网站: "国外网站",
  国内网站: "国内网站",
  广告拦截: "广告拦截",
  漏网之鱼: "漏网之鱼",
};
const STASH_ICON_FILENAME_BY_GROUP = {
  自动选择: "Speedtest.png",
  节点选择: "Proxy.png",
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
  AI平台: "AI.png",
  开发工具与镜像: "Lab.png",
  学习与研究: "Scholar.png",
  即时通讯: "Telegram.png",
  微软服务: "Microsoft.png",
  苹果服务: "Apple_2.png",
  游戏平台: "Game.png",
  国外网站: "Global.png",
  国内网站: "Domestic.png",
  广告拦截: "Advertising.png",
  漏网之鱼: "Final.png",
};

function toStashGroupName(name) {
  if (name === "DIRECT" || name === "REJECT") {
    return name;
  }
  return STASH_DISPLAY_NAME_BY_GROUP[name] || name;
}

function stashGroupIcon(name) {
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_BASE_URL}/${fileName}` : null;
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

function renderStashEntry(index) {
  const healthCheck = index.defaultHealthCheck;
  const rewriteModules = runtimeModulesByKind(index, "rewrite")
    .map((module) =>
      module.render && module.render.stashRewrite
        ? { title: module.title, line: module.render.stashRewrite }
        : null
    )
    .filter(Boolean);
  const scriptModules = runtimeModulesByKind(index, "script")
    .map((module) => module.render && module.render.stashScript)
    .filter(Boolean);
  const mitmHostnames = uniq(
    runtimeModulesByKind(index, "mitm")
      .flatMap((module) => (module.render && module.render.hostnames) || [])
      .filter(Boolean)
  );
  const stashRuleGroupName = (name) => yamlScalar(toStashGroupName(name));
  const lines = [
    "# Generated from the unified strategy model",
    "mixed-port: 7890",
    "allow-lan: false",
    "mode: rule",
    "log-level: info",
    "ipv6: true",
    "",
    "proxy-groups:",
    ...renderStashGroupHeader("自动选择", "url-test"),
    "    include-all: true",
    `    url: ${yamlScalar(healthCheck.url)}`,
    `    interval: ${healthCheck.interval}`,
    "    lazy: true",
    ...renderStashGroupHeader("节点选择", "select"),
    "    proxies:",
    `      - ${stashRuleGroupName("自动选择")}`,
    ...index.regions.map((region) => `      - ${yamlScalar(toStashGroupName(region.groupName))}`),
    "      - DIRECT",
    ...index.regions.map((region) => [
      ...renderStashGroupHeader(region.groupName, "url-test"),
      "    include-all: true",
      `    filter: ${yamlScalar(`(?i)(${region.match})`)}`,
      `    url: ${yamlScalar(healthCheck.url)}`,
      `    interval: ${healthCheck.interval}`,
      "    lazy: true",
    ].join("\n")),
    ...index.businessGroups.map((group) => [
      ...renderStashGroupHeader(group.name, "select"),
      "    proxies:",
      ...uniq(group.proxies).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`),
    ].join("\n")),
    "",
    "rule-providers:",
    ...index.ruleSets.map((ruleSet) => renderRuleProviderBlock(ruleSet)),
    "",
    "rules:",
    ...index.inlineRules.map((rule) => `  - ${yamlScalar(rule)}`),
    ...index.ruleSets.map((ruleSet) => `  - ${yamlScalar(`RULE-SET,${ruleSet.id},${toStashGroupName(ruleSet.group)}`)}`),
    `  - ${yamlScalar(`MATCH,${toStashGroupName("漏网之鱼")}`)}`,
    "",
    "url-rewrite:",
    ...rewriteModules.flatMap((rewrite) => [
      `  # ${rewrite.title}`,
      `  - ${yamlScalar(rewrite.line)}`,
    ]),
    "script:",
    ...scriptModules.flatMap((script) => [
      `  ${script.name}:`,
      "    type: generic",
      `    url: ${yamlScalar(script.url)}`,
      "    interval: 86400",
    ]),
    "  runtime-support:",
    "    type: generic",
    "    script: |",
    indentBlock(
      `const runtimeSupport = ${JSON.stringify(index.runtimeSupportMatrix, null, 2)};\nmodule.exports = runtimeSupport;`,
      6
    ),
    "mitm:",
    "  enabled: true",
    "  hostnames:",
    ...mitmHostnames.map((hostname) => `    - ${yamlScalar(hostname)}`),
  ];

  return lines.join("\n");
}

function renderMihomoEntry(index) {
  const groupsSource = [
    "  const defaultUrl = MODULE_INDEX.defaultHealthCheck.url;",
    "  const defaultInterval = MODULE_INDEX.defaultHealthCheck.interval;",
    "  const defaultTolerance = MODULE_INDEX.defaultHealthCheck.tolerance;",
    "",
    "  function buildProxyNames(config) {",
    "    return uniq((config.proxies || []).map((proxy) => proxy && proxy.name));",
    "  }",
    "",
    "  function buildRegionGroups(proxyNames) {",
    "    return MODULE_INDEX.regions.map((region) => {",
    "      const matched = proxyNames.filter((name) => new RegExp(region.match, \"i\").test(name));",
    "      return {",
    "        name: region.groupName,",
    "        type: \"url-test\",",
    "        hidden: true,",
    "        proxies: matched.length ? uniq(matched) : [\"节点选择\"],",
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
    "        return {",
    "          name: group.name,",
    "          type: group.type,",
    "          proxies: proxyNames.length ? uniq(proxyNames) : [\"DIRECT\"],",
    "          url: defaultUrl,",
    "          interval: defaultInterval,",
    "          tolerance: defaultTolerance,",
    "        };",
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
    "  function buildBusinessGroups() {",
    "    return MODULE_INDEX.businessGroups.map((group) => ({",
    "      name: group.name,",
    "      type: group.type,",
    "      proxies: uniq(group.proxies),",
    "    }));",
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
    "      ...MODULE_INDEX.inlineRules,",
    "      ...MODULE_INDEX.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.id},${ruleSet.group}`),",
    "      \"MATCH,漏网之鱼\",",
    "    ];",
    "  }",
  ].join("\n");

  return [
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
    "    ...buildRegionGroups(proxyNames),",
    "    ...buildBusinessGroups(),",
    "  ];",
    "  config[\"rule-providers\"] = buildRuleProviders();",
    "  config.rules = buildRules();",
    "  config[\"x-runtime-support\"] = MODULE_INDEX.runtimeSupportMatrix;",
    "  return config;",
    "}",
    "",
    "module.exports = {",
    "  main,",
    "  MODULE_INDEX,",
    "};",
  ].join("\n");
}

function renderSurgeEntry(index) {
  const healthCheck = index.defaultHealthCheck;
  const regionNames = index.regions.map((region) => region.groupName);
  const allPolicyRegex = "^((?!(自动选择|节点选择|DIRECT|REJECT)).)*$";
  const rewriteModules = runtimeModulesByKind(index, "rewrite")
    .map((module) =>
      module.render && module.render.surgeRewrite
        ? { title: module.title, line: module.render.surgeRewrite }
        : null
    )
    .filter(Boolean);
  const scriptModules = runtimeModulesByKind(index, "script")
    .map((module) => module.render && module.render.surgeScript)
    .filter(Boolean);
  const mitmHostnames = uniq(
    runtimeModulesByKind(index, "mitm")
      .flatMap((module) => (module.render && module.render.hostnames) || [])
      .filter(Boolean)
  );
  const lines = [
    "# Generated from the unified strategy model",
    "# The module is designed to be included on top of a profile that already resolves subscription parsing upstream.",
    "# No policy-path placeholder is used here.",
    "",
    "[General]",
    "loglevel = notify",
    "ipv6 = true",
    "enhanced-mode-by-rule = true",
    "",
    "[Proxy Group]",
    `自动选择 = url-test, policy-regex-filter='${allPolicyRegex}', url=${healthCheck.url}, interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, timeout=5`,
    `节点选择 = select, 自动选择, ${regionNames.join(", ")}, DIRECT`,
    ...index.regions.map(
      (region) =>
        `${region.groupName} = url-test, policy-regex-filter='${region.match}', url=${healthCheck.url}, interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, timeout=5`
    ),
    ...index.businessGroups.map((group) => `${group.name} = select, ${uniq(group.proxies).join(", ")}`),
    "",
    "[Rule]",
    "RULE-SET,LAN,DIRECT",
    ...index.inlineRules,
    ...index.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.urls.surge},${ruleSet.group},extended-matching`),
    "FINAL,漏网之鱼",
    "",
    "[URL Rewrite]",
    ...rewriteModules.flatMap((rewrite) => [`# ${rewrite.title}`, rewrite.line]),
    "",
    "[Script]",
    ...scriptModules.map(
      (script) =>
        `${script.name} = type=${script.type}, pattern=${script.pattern}, script-path=${script.url}, timeout=10`
    ),
    "",
    "[MITM]",
    `hostname = %APPEND% ${mitmHostnames.join(", ")}`,
  ];

  return lines.join("\n");
}

module.exports = {
  renderMihomoEntry,
  renderStashEntry,
  renderSurgeEntry,
};
