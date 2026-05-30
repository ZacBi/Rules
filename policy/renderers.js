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
const NOISE_POLICY_PATTERN = "剩余|流量|到期|过期|套餐|官网|订阅|更新|重置|用户|倍率|余额|Traffic|Expire|Expiry|Subscription|Reset";
const RESERVED_POLICY_PATTERN = "全部节点|自动选择|节点选择|DIRECT|REJECT";
const QUANTUMULTX_RESOURCE_UPDATE_INTERVAL = 172800;
const STASH_ICON_FILENAME_BY_GROUP = {
  全部节点: "Proxy.png",
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
  Claude: "AI.png",
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
  return name;
}

function stashGroupIcon(name) {
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_BASE_URL}/${fileName}` : null;
}

function quantumultxPolicyIcon(name) {
  const fileName = STASH_ICON_FILENAME_BY_GROUP[name];
  return fileName ? `${QURE_ICON_BASE_URL}/${fileName}` : null;
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

function renderStashStrategyGroup(index, group) {
  const healthCheck = index.defaultHealthCheck;
  const lines = renderStashGroupHeader(group.name, group.type);

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

  lines.push("    proxies:", ...uniq(group.proxies).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`));
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

function renderStashBusinessGroup(group) {
  return [
    ...renderStashGroupHeader(group.name, "select"),
    "    proxies:",
    ...uniq(group.proxies).map((proxy) => `      - ${yamlScalar(toStashGroupName(proxy))}`),
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
    "desc: Stash iOS 轻量分组、规则集、常见 HTTP 改写与脚本入口。",
    "homepage: https://github.com/ZacBi/Rules",
    "author: Rules contributors",
    "category: Policy",
    "mixed-port: 7890",
    "allow-lan: false",
    "mode: rule",
    "log-level: info",
    "ipv6: false",
    "",
    "proxy-groups: #!replace",
    ...index.strategyGroups.map((group) => renderStashStrategyGroup(index, group)),
    ...index.serviceCheckGroups.map((group) => renderStashServiceCheckGroup(group)),
    ...index.businessGroups.map((group) => renderStashBusinessGroup(group)),
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

function renderSurgeEntry(index) {
  const healthCheck = index.defaultHealthCheck;
  const allPolicyRegex = surgePolicyFilter();
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
    "# Generated from the unified strategy model",
    "# The module is designed to be included on top of a profile that already resolves subscription parsing upstream.",
    "# No policy-path placeholder is used here.",
    "",
    "[General]",
    "loglevel = notify",
    "ipv6 = false",
    "enhanced-mode-by-rule = true",
    "",
    "[Proxy Group]",
    ...index.strategyGroups.map((group) => renderSurgeStrategyGroup(group, healthCheck, allPolicyRegex)),
    ...index.serviceCheckGroups.map(
      (group) =>
        `${group.name} = url-test, ${uniq(group.proxies).join(", ")}, url=${group.url}, interval=${group.interval}, tolerance=${group.tolerance}, timeout=${group.timeout}`
    ),
    ...index.regions.map(
      (region) =>
        `${region.groupName} = url-test, include-all-proxies=true, policy-regex-filter='${surgePolicyFilter(region.match)}', url=${healthCheck.url}, interval=${healthCheck.interval}, tolerance=${healthCheck.tolerance}, timeout=${healthCheck.timeout}`
    ),
    ...index.businessGroups.map((group) => `${group.name} = select, ${uniq(group.proxies).join(", ")}`),
    "",
    "[Rule]",
    "RULE-SET,LAN,DIRECT",
    ...index.inlineRules,
    ...index.routingRules.map((route) => renderRouteRule(route.rule, route.group)),
    ...index.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.urls.surge},${ruleSet.group},extended-matching`),
    "FINAL,漏网之鱼",
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
    `static=${group.name}, ${uniq(group.proxies).map(toQuantumultxPolicyName).join(", ")}`,
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

function renderQuantumultxBusinessGroup(group) {
  return withQuantumultxPolicyIcon(
    `static=${group.name}, ${uniq(group.proxies).map(toQuantumultxPolicyName).join(", ")}`,
    group.name
  );
}

function renderQuantumultxRouteRule(rule, groupName) {
  const parts = rule.split(",");
  parts[0] = parts[0].toLowerCase();
  return `${parts.join(",")},${toQuantumultxPolicyName(groupName)}`;
}

function renderQuantumultxInlineRule(rule) {
  const parts = rule.split(",");
  if (parts.length < 3) {
    return rule;
  }
  const policyIndex = parts[parts.length - 1] === "no-resolve" ? parts.length - 2 : parts.length - 1;
  if (parts[0] === "IP-CIDR6") {
    parts[0] = "ip6-cidr";
  } else {
    parts[0] = parts[0].toLowerCase();
  }
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
    "no-ipv6",
    "server=223.5.5.5",
    "server=119.29.29.29",
    "",
    "[policy]",
    ...index.strategyGroups.map((group) => renderQuantumultxPolicyGroup(group, index)),
    ...index.serviceCheckGroups.map((group) => renderQuantumultxServiceCheckGroup(group)),
    ...index.regions.map((region) => renderQuantumultxRegionGroup(region, index)),
    ...index.businessGroups.map((group) => renderQuantumultxBusinessGroup(group)),
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

module.exports = {
  renderMihomoEntry,
  renderClashPartyEntry,
  renderQuantumultxEntry,
  renderStashEntry,
  renderSurgeEntry,
};
