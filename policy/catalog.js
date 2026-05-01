"use strict";

const defaultHealthCheck = {
  url: "https://www.gstatic.com/generate_204",
  interval: 600,
  tolerance: 100,
  timeout: 3,
};

const regions = [
  {
    key: "hong_kong",
    name: "香港",
    groupName: "香港节点",
    match: "香港|HK|Hong\\s*Kong",
  },
  {
    key: "taiwan",
    name: "台湾",
    groupName: "台湾节点",
    match: "台湾|TW|Taiwan|Taipei",
  },
  {
    key: "japan",
    name: "日本",
    groupName: "日本节点",
    match: "日本|JP|Japan|Tokyo|Osaka",
  },
  {
    key: "singapore",
    name: "新加坡",
    groupName: "新加坡节点",
    match: "新加坡|狮城|SG|Singapore",
  },
  {
    key: "united_states",
    name: "美国",
    groupName: "美国节点",
    match: "美国|US|USA|United\\s*States|America|Los\\s*Angeles|San\\s*Jose|Seattle",
  },
  {
    key: "united_kingdom",
    name: "英国",
    groupName: "英国节点",
    match: "英国|UK|United\\s*Kingdom|Britain|England|London|Manchester",
  },
  {
    key: "australia",
    name: "澳洲",
    groupName: "澳洲节点",
    match: "澳洲|澳大利亚|AU|Australia|Sydney|Melbourne|Perth",
  },
  {
    key: "malaysia",
    name: "马来西亚",
    groupName: "马来西亚节点",
    match: "马来西亚|MY|Malaysia|Kuala\\s*Lumpur",
  },
  {
    key: "argentina",
    name: "阿根廷",
    groupName: "阿根廷节点",
    match: "阿根廷|AR|Argentina|Buenos\\s*Aires",
  },
];

function pickRegionGroupNames(keys) {
  const wanted = new Set(keys);
  return regions
    .filter((region) => wanted.has(region.key))
    .map((region) => region.groupName);
}

const coreRegionGroupNames = pickRegionGroupNames([
  "hong_kong",
  "taiwan",
  "japan",
  "singapore",
  "united_states",
]);
const aiRegionGroupNames = pickRegionGroupNames([
  "united_states",
  "japan",
  "singapore",
  "hong_kong",
]);
const devRegionGroupNames = pickRegionGroupNames([
  "hong_kong",
  "japan",
  "singapore",
  "united_states",
]);
const mediaRegionGroupNames = pickRegionGroupNames([
  "hong_kong",
  "taiwan",
  "japan",
  "singapore",
  "united_states",
]);
const defaultProxyGroupNames = ["节点选择", "自动选择"];

const strategyGroups = [
  {
    key: "auto",
    name: "自动选择",
    type: "url-test",
    mode: "all-proxies",
  },
  {
    key: "select",
    name: "节点选择",
    type: "select",
    proxies: ["自动选择", ...regions.map((region) => region.groupName), "DIRECT"],
  },
];

const businessGroups = [
  {
    name: "国外媒体",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...mediaRegionGroupNames],
  },
  {
    name: "AI平台",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...aiRegionGroupNames],
  },
  {
    name: "开发工具与镜像",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...devRegionGroupNames, "DIRECT"],
  },
  {
    name: "学习与研究",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...coreRegionGroupNames, "DIRECT"],
  },
  {
    name: "即时通讯",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...coreRegionGroupNames],
  },
  {
    name: "微软服务",
    type: "select",
    proxies: ["DIRECT", ...defaultProxyGroupNames, ...devRegionGroupNames],
  },
  {
    name: "苹果服务",
    type: "select",
    proxies: ["DIRECT", ...defaultProxyGroupNames],
  },
  {
    name: "游戏平台",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...coreRegionGroupNames],
  },
  {
    name: "国外网站",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...coreRegionGroupNames],
  },
  {
    name: "国内网站",
    type: "select",
    proxies: ["DIRECT", "节点选择"],
  },
  {
    name: "广告拦截",
    type: "select",
    proxies: ["REJECT", "DIRECT"],
  },
  {
    name: "漏网之鱼",
    type: "select",
    proxies: ["节点选择", "自动选择", "DIRECT"],
  },
];

const rawRuleSets = [
  {
    key: "advertising",
    sourceName: "Advertising",
    group: "广告拦截",
    behavior: "classical",
  },
  {
    key: "lan",
    sourceName: "Lan",
    group: "国内网站",
    behavior: "classical",
  },
  {
    key: "china",
    sourceName: "ChinaMax",
    mihomoFile: "ChinaMax_Domain",
    group: "国内网站",
    behavior: "domain",
  },
  {
    key: "chinamedia",
    sourceName: "ChinaMedia",
    group: "国内网站",
    behavior: "classical",
  },
  {
    key: "openai",
    sourceName: "OpenAI",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "claude",
    sourceName: "Claude",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "anthropic",
    sourceName: "Anthropic",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "gemini",
    sourceName: "Gemini",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "copilot",
    sourceName: "Copilot",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "youtube",
    sourceName: "YouTube",
    group: "国外媒体",
    behavior: "classical",
  },
  {
    key: "netflix",
    sourceName: "Netflix",
    group: "国外媒体",
    behavior: "classical",
  },
  {
    key: "spotify",
    sourceName: "Spotify",
    group: "国外媒体",
    behavior: "classical",
  },
  {
    key: "tiktok",
    sourceName: "TikTok",
    group: "国外媒体",
    behavior: "classical",
  },
  {
    key: "globalmedia",
    sourceName: "GlobalMedia",
    group: "国外媒体",
    behavior: "classical",
  },
  {
    key: "github",
    sourceName: "GitHub",
    group: "开发工具与镜像",
    behavior: "classical",
  },
  {
    key: "npmjs",
    sourceName: "Npmjs",
    group: "开发工具与镜像",
    behavior: "classical",
  },
  {
    key: "docker",
    sourceName: "Docker",
    group: "开发工具与镜像",
    behavior: "classical",
  },
  {
    key: "python",
    sourceName: "Python",
    group: "开发工具与镜像",
    behavior: "classical",
  },
  {
    key: "gitlab",
    sourceName: "GitLab",
    group: "开发工具与镜像",
    behavior: "classical",
  },
  {
    key: "scholar",
    sourceName: "Scholar",
    group: "学习与研究",
    behavior: "classical",
  },
  {
    key: "wikipedia",
    sourceName: "Wikipedia",
    group: "学习与研究",
    behavior: "classical",
  },
  {
    key: "stackexchange",
    sourceName: "Stackexchange",
    group: "学习与研究",
    behavior: "classical",
  },
  {
    key: "google",
    sourceName: "Google",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "telegram",
    sourceName: "Telegram",
    group: "即时通讯",
    behavior: "classical",
  },
  {
    key: "discord",
    sourceName: "Discord",
    group: "即时通讯",
    behavior: "classical",
  },
  {
    key: "twitter",
    sourceName: "Twitter",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "microsoft",
    sourceName: "Microsoft",
    group: "微软服务",
    behavior: "classical",
  },
  {
    key: "apple",
    sourceName: "Apple",
    group: "苹果服务",
    behavior: "classical",
  },
  {
    key: "steam",
    sourceName: "Steam",
    group: "游戏平台",
    behavior: "classical",
  },
  {
    key: "epic",
    sourceName: "Epic",
    group: "游戏平台",
    behavior: "classical",
  },
];

const RULES_GITHUB_REPO = process.env.RULES_GITHUB_REPO || null;
const RULES_RAW_BASE = RULES_GITHUB_REPO
  ? `https://raw.githubusercontent.com/${RULES_GITHUB_REPO}/master`
  : null;

if (RULES_RAW_BASE) {
  rawRuleSets.splice(rawRuleSets.findIndex((ruleSet) => ruleSet.key === "youtube"), 0, {
    key: "cursor",
    sourceName: "Cursor",
    group: "AI平台",
    behavior: "classical",
    mihomoUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.yaml`,
    mihomoPath: "./ruleset/Cursor.yaml",
    surgeUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.list`,
    surgeLocalRelativeToSurgeDir: "../mihomo/ruleset/Cursor.list",
  });
}

function uniq(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function withDerivedUrls(entry) {
  const base = "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule";
  const mihomoFile = entry.mihomoFile || entry.sourceName;
  return {
    ...entry,
    mihomoUrl:
      entry.mihomoUrl ??
      `${base}/Clash/${entry.sourceName}/${mihomoFile}.yaml`,
    mihomoPath: entry.mihomoPath ?? `./ruleset/${mihomoFile}.yaml`,
    surgeUrl:
      entry.surgeUrl ??
      `${base}/Surge/${entry.sourceName}/${entry.sourceName}.list`,
  };
}

function surgeRuleSetLocation(ruleSet) {
  if (
    ruleSet.surgeLocalRelativeToSurgeDir &&
    !RULES_GITHUB_REPO
  ) {
    return ruleSet.surgeLocalRelativeToSurgeDir;
  }
  return ruleSet.surgeUrl;
}

const supportedClients = ["stash", "mihomo", "surge"];

const runtimeModules = [
  {
    id: "runtime.ai.assistant",
    kind: "script",
    domain: "ai",
    title: "assistant-panel",
    emitByDefault: false,
    sourceMode: "remote",
    sourceUrl: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/openai/openai-panel.js",
    supportedClients,
    support: {
      supportLevel: {
        stash: "full",
        surge: "full",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Use through Stash script runtime or Script Hub.",
        surge: "Use through Surge script runtime.",
        mihomo: "No equivalent cross-client script runtime is emitted by override.js.",
      },
    },
    dependencies: ["scenario.ai"],
    conflicts: [],
    render: {
      stashScript: {
        name: "assistant-panel",
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/openai/openai-panel.js",
      },
      surgeScript: {
        name: "assistant-panel",
        type: "http-response",
        pattern: "^https://(chatgpt|api\\.openai)\\.com/.*",
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/openai/openai-panel.js",
      },
    },
  },
  {
    id: "runtime.media.unlock",
    kind: "rewrite",
    domain: "media",
    title: "reject-tracking",
    emitByDefault: false,
    sourceMode: "local",
    supportedClients,
    support: {
      supportLevel: {
        stash: "full",
        surge: "full",
        mihomo: "partial",
      },
      notes: {
        stash: "Rendered as native url-rewrite lines.",
        surge: "Rendered as native URL Rewrite rules.",
        mihomo: "Documented in metadata only; override.js does not emit rewrite rules.",
      },
    },
    dependencies: ["scenario.media"],
    conflicts: [],
    render: {
      stashRewrite: "^https?:\\/\\/([^/]+)\\/.*[?&](utm_(source|medium|campaign)|spm)=.*$ 302 https://$1/",
      surgeRewrite: "^https?:\\/\\/([^/]+)\\/.*[?&](utm_(source|medium|campaign)|spm)=.*$ 302 https://$1/",
    },
  },
  {
    id: "runtime.core.mitm",
    kind: "mitm",
    domain: "developer",
    title: "tls-hosts",
    emitByDefault: false,
    sourceMode: "local",
    supportedClients,
    support: {
      supportLevel: {
        stash: "full",
        surge: "full",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Rendered as MITM hostnames.",
        surge: "Rendered as MITM hostname append list.",
        mihomo: "MITM is not emitted from the generic Mihomo override.",
      },
    },
    dependencies: ["base.core"],
    conflicts: [],
    render: {
      hostnames: ["*.openai.com", "*.anthropic.com", "*.githubusercontent.com"],
    },
  },
];

const runtimeSupportMatrix = {
  stash: {
    rewrite: "full",
    script: "full",
    mitm: "full",
  },
  surge: {
    rewrite: "full",
    script: "full",
    mitm: "full",
  },
  mihomo: {
    rewrite: "partial",
    script: "unsupported",
    mitm: "unsupported",
  },
};

function withRuleSetMetadata(entry) {
  return {
    id: entry.key,
    sourceName: entry.sourceName,
    group: entry.group,
    behavior: entry.behavior,
    origin: entry.key === "cursor" ? "project" : "blackmatrix7",
    urls: {
      mihomo: entry.mihomoUrl,
      surge: entry.surgeUrl,
    },
    paths: {
      mihomo: entry.mihomoPath,
    },
    supportedClients,
  };
}

function moduleTemplate(options) {
  const {
    id,
    layer,
    domain,
    title,
    groups = [],
    ruleSets = [],
    dependsOn = [],
    output = null,
    capabilities = {},
    conflicts = [],
    notes = [],
  } = options;

  return {
    id,
    layer,
    domain,
    title,
    groups,
    ruleSets,
    dependsOn,
    output,
    supportedClients,
    capabilities: {
      routing: false,
      rewrite: false,
      script: false,
      mitm: false,
      ...capabilities,
    },
    conflicts,
    notes,
  };
}

const normalizedRuleSets = rawRuleSets.map(withDerivedUrls).map(withRuleSetMetadata);
const regionGroupNames = regions.map((region) => region.groupName);
const businessGroupNames = businessGroups.map((group) => group.name);

const baseModule = moduleTemplate({
  id: "base.core",
  layer: "base",
  domain: "core",
  title: "Core strategy scaffold",
  groups: uniq([
    ...strategyGroups.map((group) => group.name),
    ...regionGroupNames,
    "漏网之鱼",
  ]),
  ruleSets: ["advertising", "lan", "china"],
  capabilities: {
    routing: true,
    rewrite: true,
    script: true,
    mitm: true,
  },
});

const scenarioModules = [
  moduleTemplate({
    id: "scenario.ai",
    layer: "scenario",
    domain: "ai",
    title: "AI platforms",
    groups: ["AI平台"],
    ruleSets: uniq(["openai", "claude", "anthropic", "gemini", "copilot", RULES_GITHUB_REPO ? "cursor" : null]),
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.media",
    layer: "scenario",
    domain: "media",
    title: "Streaming media",
    groups: ["国外媒体"],
    ruleSets: ["youtube", "netflix", "spotify", "tiktok", "globalmedia"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.dev",
    layer: "scenario",
    domain: "dev",
    title: "Developer tools",
    groups: ["开发工具与镜像"],
    ruleSets: ["github", "npmjs", "docker", "python", "gitlab"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.research",
    layer: "scenario",
    domain: "research",
    title: "Learning and research",
    groups: ["学习与研究"],
    ruleSets: ["scholar", "wikipedia", "stackexchange"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.chat",
    layer: "scenario",
    domain: "chat",
    title: "Messaging",
    groups: ["即时通讯"],
    ruleSets: ["telegram", "discord"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.vendor",
    layer: "scenario",
    domain: "vendor",
    title: "Vendor services",
    groups: ["微软服务", "苹果服务"],
    ruleSets: ["microsoft", "apple"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.games",
    layer: "scenario",
    domain: "games",
    title: "Gaming platforms",
    groups: ["游戏平台"],
    ruleSets: ["steam", "epic"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.web",
    layer: "scenario",
    domain: "web",
    title: "Global web",
    groups: ["国外网站"],
    ruleSets: ["google", "twitter"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.domestic",
    layer: "scenario",
    domain: "domestic",
    title: "Domestic routing",
    groups: ["国内网站"],
    ruleSets: ["chinamedia"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.ads",
    layer: "scenario",
    domain: "ads",
    title: "Ad blocking",
    groups: ["广告拦截"],
    ruleSets: [],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.fallback",
    layer: "scenario",
    domain: "fallback",
    title: "Catch-all routing",
    groups: ["漏网之鱼"],
    ruleSets: [],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
];

const entryComposition = uniq(["base.core", ...scenarioModules.map((module) => module.id)]);

const clientModules = [
  moduleTemplate({
    id: "client.stash.entry",
    layer: "client",
    domain: "stash",
    title: "Stash entry override",
    dependsOn: entryComposition,
    groups: uniq([
      ...strategyGroups.map((group) => group.name),
      ...businessGroupNames,
    ]),
    output: {
      path: "dist/stash/stash.stoverride",
      format: "stash-override",
    },
    capabilities: {
      routing: true,
      rewrite: true,
      script: true,
      mitm: true,
    },
    notes: ["Designed for clients that already resolve subscription parsing upstream."],
  }),
  moduleTemplate({
    id: "client.mihomo.entry",
    layer: "client",
    domain: "mihomo",
    title: "Mihomo entry override",
    dependsOn: entryComposition,
    groups: uniq([
      ...strategyGroups.map((group) => group.name),
      ...businessGroupNames,
    ]),
    output: {
      path: "dist/mihomo/override.js",
      format: "mihomo-override-js",
    },
    capabilities: {
      routing: true,
      rewrite: false,
      script: false,
      mitm: false,
    },
    notes: ["Rendered as an override script with explicit runtime capability downgrades."],
  }),
  moduleTemplate({
    id: "client.surge.entry",
    layer: "client",
    domain: "surge",
    title: "Surge entry module",
    dependsOn: entryComposition,
    groups: uniq([
      ...strategyGroups.map((group) => group.name),
      ...businessGroupNames,
    ]),
    output: {
      path: "dist/surge/module.sgmodule",
      format: "surge-module",
    },
    capabilities: {
      routing: true,
      rewrite: true,
      script: true,
      mitm: true,
    },
    notes: ["Rendered as a reusable Surge module fragment rather than a full profile."],
  }),
];

function buildEntrypoints() {
  return {
    stash: {
      moduleId: "client.stash.entry",
      modules: entryComposition,
      outputPath: "dist/stash/stash.stoverride",
      format: "stash-override",
    },
    mihomo: {
      moduleId: "client.mihomo.entry",
      modules: entryComposition,
      outputPath: "dist/mihomo/override.js",
      format: "mihomo-override-js",
    },
    surge: {
      moduleId: "client.surge.entry",
      modules: entryComposition,
      outputPath: "dist/surge/module.sgmodule",
      format: "surge-module",
    },
  };
}

function buildModuleIndex() {
  return {
    schemaVersion: 1,
    model: "unified-strategy-pack",
    defaultHealthCheck,
    strategyGroups,
    businessGroups,
    regions,
    ruleSets: normalizedRuleSets,
    runtimeModules,
    runtimeSupportMatrix,
    inlineRules: [
      "DOMAIN,localhost,DIRECT",
      "DOMAIN-SUFFIX,local,DIRECT",
      "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
      "IP-CIDR6,::1/128,DIRECT,no-resolve",
    ],
    modules: [
      baseModule,
      ...scenarioModules,
      ...clientModules,
    ],
    entrypoints: buildEntrypoints(),
  };
}

module.exports = {
  buildModuleIndex,
  defaultHealthCheck,
  regions,
  strategyGroups,
  businessGroups,
  rulesets: normalizedRuleSets,
  surgeRuleSetLocation,
};
