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

const RULES_GITHUB_REPO = process.env.RULES_GITHUB_REPO || null;
const RULES_RAW_BASE = RULES_GITHUB_REPO
  ? `https://raw.githubusercontent.com/${RULES_GITHUB_REPO}/master`
  : null;
const PROJECT_RAW_BASE =
  RULES_RAW_BASE || "https://raw.githubusercontent.com/ZacBi/Rules/master";

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
const defaultProxyGroupNames = ["节点选择", "自动选择", "全部节点"];

const serviceCheckGroups = [];

const strategyGroups = [
  {
    key: "all",
    name: "全部节点",
    type: "select",
    mode: "all-proxies",
  },
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
    proxies: ["自动选择", "全部节点", ...regions.map((region) => region.groupName), "DIRECT"],
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
    name: "Claude",
    type: "select",
    proxies: [...defaultProxyGroupNames, ...regions.map((region) => region.groupName)],
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
    name: "金融网站",
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
    name: "字节跳动",
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

const stashEnhancementGroups = [
  {
    name: "香港优先",
    type: "fallback",
    hidden: true,
    match: regions.find((region) => region.key === "hong_kong").match,
  },
  {
    name: "媒体负载均衡",
    type: "load-balance",
    hidden: true,
    strategy: "consistent-hashing",
    match: [
      "香港",
      "HK",
      "Hong\\s*Kong",
      "台湾",
      "TW",
      "Taiwan",
      "Taipei",
      "日本",
      "JP",
      "Japan",
      "Tokyo",
      "Osaka",
      "新加坡",
      "狮城",
      "SG",
      "Singapore",
      "美国",
      "US",
      "USA",
      "United\\s*States",
      "America",
      "Los\\s*Angeles",
      "San\\s*Jose",
      "Seattle",
    ].join("|"),
  },
];

const stashPolicyChoices = {
  国外媒体: {
    after: "自动选择",
    choices: ["媒体负载均衡"],
  },
};

const quantumultxEnhancementGroups = [
  {
    name: "香港优先",
    type: "available",
    match: regions.find((region) => region.key === "hong_kong").match,
  },
  {
    name: "媒体轮询",
    type: "round-robin",
    match: stashEnhancementGroups.find((group) => group.name === "媒体负载均衡").match,
  },
];

const quantumultxPolicyChoices = {
  节点选择: ["香港优先"],
  国外媒体: ["媒体轮询"],
};

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
    key: "bilibili",
    sourceName: "BiliBili",
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
    key: "bytedance",
    sourceName: "ByteDance",
    group: "字节跳动",
    behavior: "classical",
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
    group: "Claude",
    behavior: "classical",
  },
  {
    key: "anthropic",
    sourceName: "Anthropic",
    group: "Claude",
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
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "npmjs",
    sourceName: "Npmjs",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "docker",
    sourceName: "Docker",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "python",
    sourceName: "Python",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "gitlab",
    sourceName: "GitLab",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "scholar",
    sourceName: "Scholar",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "wikipedia",
    sourceName: "Wikipedia",
    group: "国外网站",
    behavior: "classical",
  },
  {
    key: "stackexchange",
    sourceName: "Stackexchange",
    group: "国外网站",
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
  {
    key: "longbridge",
    sourceName: "Longbridge",
    group: "金融网站",
    behavior: "classical",
    origin: "project",
    mihomoUrl: `${PROJECT_RAW_BASE}/rules/longbridge.yaml`,
    mihomoPath: "./ruleset/Longbridge.yaml",
    surgeUrl: `${PROJECT_RAW_BASE}/rules/longbridge.list`,
    quantumultxUrl: `${PROJECT_RAW_BASE}/rules/longbridge.list`,
  },
  {
    key: "ibkr",
    sourceName: "IBKR",
    group: "金融网站",
    behavior: "classical",
    origin: "project",
    mihomoUrl: `${PROJECT_RAW_BASE}/rules/ibkr.yaml`,
    mihomoPath: "./ruleset/IBKR.yaml",
    surgeUrl: `${PROJECT_RAW_BASE}/rules/ibkr.list`,
    quantumultxUrl: `${PROJECT_RAW_BASE}/rules/ibkr.list`,
  },
  {
    key: "tigerfintech",
    sourceName: "TigerFintech",
    group: "金融网站",
    behavior: "classical",
  },
];

if (RULES_RAW_BASE) {
  rawRuleSets.splice(rawRuleSets.findIndex((ruleSet) => ruleSet.key === "youtube"), 0, {
    key: "cursor",
    sourceName: "Cursor",
    group: "AI平台",
    behavior: "classical",
    mihomoUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.yaml`,
    mihomoPath: "./ruleset/Cursor.yaml",
    surgeUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.list`,
    quantumultxUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.list`,
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
    quantumultxUrl:
      entry.quantumultxUrl ??
      `${base}/QuantumultX/${entry.sourceName}/${entry.sourceName}.list`,
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

const supportedClients = ["stash", "mihomo", "surge", "quantumultx"];

const runtimeModules = [
  {
    id: "runtime.ai.assistant",
    kind: "script",
    domain: "ai",
    title: "assistant-panel",
    emitByDefault: false,
    sourceMode: "unresolved",
    sourceUrl: null,
    supportedClients,
    support: {
      supportLevel: {
        stash: "partial",
        surge: "partial",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Metadata only until a maintained upstream script URL is selected.",
        surge: "Metadata only until a maintained upstream script URL is selected.",
        mihomo: "No equivalent cross-client script runtime is emitted by override.js.",
      },
    },
    dependencies: ["scenario.ai"],
    conflicts: [],
    render: {},
    ui: {
      title: "AI assistant panel",
      surface: "script",
      defaultState: "opt-in",
      riskLevel: "medium",
      requiresMitm: false,
      defaultEnabled: false,
      iosPerformanceCost: "medium",
      performanceNote: "Requires HTTP script runtime; keep disabled unless the panel is needed.",
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
        stash: "partial",
        surge: "partial",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Metadata only. The previous broad redirect dropped useful URL state and is intentionally not emitted.",
        surge: "Metadata only. The previous broad redirect dropped useful URL state and is intentionally not emitted.",
        mihomo: "Mihomo and Clash Party do not consume Stash or Surge HTTP rewrite sections.",
      },
    },
    dependencies: ["scenario.media"],
    conflicts: [],
    render: {},
    ui: {
      title: "Tracking parameter cleanup",
      surface: "rewrite",
      defaultState: "disabled",
      riskLevel: "high",
      requiresMitm: false,
      defaultEnabled: false,
      iosPerformanceCost: "low",
      performanceNote: "Disabled until a path-preserving cleaner is available; broad redirects can break pages.",
    },
  },
  {
    id: "runtime.app.upgrade-check",
    kind: "rewrite",
    domain: "utility",
    title: "app-upgrade-check-block",
    emitByDefault: true,
    sourceMode: "remote-derived",
    sourceUrl: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rewrite/Stash/Upgrade/Upgrade.stoverride",
    supportedClients: ["stash"],
    support: {
      supportLevel: {
        stash: "full",
        surge: "unsupported",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Derived from blackmatrix7 ios_rule_script Stash Upgrade rewrite.",
        surge: "Use the upstream Surge module directly if needed.",
        mihomo: "No equivalent runtime rewrite is emitted by override.js.",
      },
    },
    dependencies: ["base.core"],
    conflicts: [],
    render: {
      stashRewrite: [
        "^https?:\\/\\/api\\.ishansong\\.com\\/app\\/check\\/v\\d+\\/check - reject",
        "^https?:\\/\\/api\\.m\\.jd\\.com\\/openUpgrade - reject",
        "^https?:\\/\\/apimobile\\.meituan\\.com\\/appupdate\\/mach\\/checkUpdate? - reject",
        "^https?:\\/\\/apprn\\.pizzahut\\.com\\.cn\\/updateCheck\\? - reject",
        "^https?:\\/\\/capis(-?\\w*)?\\.didapinche\\.com\\/publish\\/api\\/upgrade - reject",
        "^https?:\\/\\/ccsp-egmas\\.sf-express\\.com\\/cx-app-base\\/base\\/app\\/appVersion\\/detectionUpgrade - reject",
        "^https?:\\/\\/fmapp\\.chinafamilymart\\.com\\.cn\\/api\\/app\\/biz\\/base\\/appversion\\/latest - reject",
        "^https?:\\/\\/m\\.client\\.10010\\.com\\/mobileService\\/(activity|customer)\\/(accountListData|get_client_adv|get_startadv) - reject",
        "^https?:\\/\\/sso\\.lxjapp\\.com\\/\\/chims\\/servlet\\/csGetLatestSoftwareVersionServlet - reject",
        "^https?:\\/\\/www\\.meituan\\.com\\/api\\/v\\d\\/appstatus\\? - reject",
      ],
      hostnames: [
        "api.ishansong.com",
        "api.m.jd.com",
        "apimobile.meituan.com",
        "apprn.pizzahut.com.cn",
        "capis*.didapinche.com",
        "ccsp-egmas.sf-express.com",
        "fmapp.chinafamilymart.com.cn",
        "m.client.10010.com",
        "sso.lxjapp.com",
        "www.meituan.com",
      ],
    },
    ui: {
      title: "Block common app upgrade checks",
      surface: "rewrite",
      defaultState: "enabled",
      riskLevel: "medium",
      requiresMitm: true,
      defaultEnabled: true,
      iosPerformanceCost: "low",
      performanceNote: "Small Stash rewrite subset derived from upstream; HTTPS matches require MITM hosts.",
    },
  },
  {
    id: "runtime.google.no-country-redirect",
    kind: "rewrite",
    domain: "google",
    title: "google-no-country-redirect",
    emitByDefault: true,
    sourceMode: "local",
    sourceUrl: "https://stash.wiki/http-engine/rewrite",
    supportedClients: ["stash"],
    support: {
      supportLevel: {
        stash: "full",
        surge: "unsupported",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Keeps Google Hong Kong entry URLs on google.com without changing DNS or routing policy.",
        surge: "Use a client-side URL rewrite module if needed.",
        mihomo: "No equivalent runtime rewrite is emitted by override.js.",
      },
    },
    dependencies: ["scenario.web"],
    conflicts: [],
    render: {
      stashRewrite: [
        "^https?:\\/\\/www\\.google\\.com\\.hk\\/?$ https://www.google.com/ncr 302",
        "^https?:\\/\\/www\\.google\\.com\\.hk\\/(.*) https://www.google.com/$1 302",
      ],
      hostnames: ["www.google.com.hk"],
    },
    ui: {
      title: "Google no country redirect",
      surface: "rewrite",
      defaultState: "enabled",
      riskLevel: "medium",
      requiresMitm: true,
      defaultEnabled: true,
      iosPerformanceCost: "low",
      performanceNote: "Narrow redirect for Google Hong Kong URLs; HTTPS matching requires MITM for www.google.com.hk.",
    },
  },
  {
    id: "runtime.apple.testflight-download",
    kind: "script",
    domain: "apple",
    title: "testflight-download-fix",
    emitByDefault: true,
    sourceMode: "remote",
    sourceUrl: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/external/Stash/TestFlight/TestFlight.stoverride",
    supportedClients: ["stash"],
    support: {
      supportLevel: {
        stash: "full",
        surge: "unsupported",
        mihomo: "unsupported",
      },
      notes: {
        stash: "Uses the script provider URL from blackmatrix7 ios_rule_script external Stash TestFlight.",
        surge: "Use the upstream Surge module directly if needed.",
        mihomo: "No equivalent runtime script is emitted by override.js.",
      },
    },
    dependencies: ["scenario.vendor"],
    conflicts: [],
    render: {
      stashScript: {
        name: "testflight-download-fix",
        type: "request",
        match: "^https?:\\/\\/testflight\\.apple\\.com\\/v\\d\\/accounts\\/.+?\\/install$",
        requireBody: true,
        timeout: 30,
        argument: "",
        binaryMode: false,
        maxSize: 1048576,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/javascript/043922e05c79445b6da818d0864c1b7d.js",
      },
      hostnames: ["testflight.apple.com"],
    },
    ui: {
      title: "TestFlight download fix",
      surface: "script",
      defaultState: "enabled",
      riskLevel: "medium",
      requiresMitm: true,
      defaultEnabled: true,
      iosPerformanceCost: "medium",
      performanceNote: "Requires request body and MITM only for TestFlight install requests.",
    },
  },
  {
    id: "runtime.mitm.openai",
    kind: "mitm",
    domain: "ai",
    title: "openai-tls-hosts",
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
      hostnames: ["*.openai.com"],
    },
    ui: {
      title: "OpenAI TLS inspection hosts",
      surface: "mitm",
      defaultState: "opt-in",
      riskLevel: "high",
      requiresMitm: true,
      defaultEnabled: false,
      iosPerformanceCost: "high",
      performanceNote: "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows.",
    },
  },
  {
    id: "runtime.mitm.anthropic",
    kind: "mitm",
    domain: "ai",
    title: "anthropic-tls-hosts",
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
      hostnames: ["*.anthropic.com"],
    },
    ui: {
      title: "Anthropic TLS inspection hosts",
      surface: "mitm",
      defaultState: "opt-in",
      riskLevel: "high",
      requiresMitm: true,
      defaultEnabled: false,
      iosPerformanceCost: "high",
      performanceNote: "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows.",
    },
  },
  {
    id: "runtime.mitm.githubusercontent",
    kind: "mitm",
    domain: "developer",
    title: "githubusercontent-tls-hosts",
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
      hostnames: ["*.githubusercontent.com"],
    },
    ui: {
      title: "GitHub raw asset TLS inspection hosts",
      surface: "mitm",
      defaultState: "opt-in",
      riskLevel: "high",
      requiresMitm: true,
      defaultEnabled: false,
      iosPerformanceCost: "high",
      performanceNote: "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows.",
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
    rewrite: "unsupported",
    script: "unsupported",
    mitm: "unsupported",
  },
  quantumultx: {
    rewrite: "metadata-only",
    script: "metadata-only",
    mitm: "metadata-only",
  },
};

function withRuleSetMetadata(entry) {
  return {
    id: entry.key,
    sourceName: entry.sourceName,
    group: entry.group,
    behavior: entry.behavior,
    origin: entry.origin ?? (entry.key === "cursor" ? "project" : "blackmatrix7"),
    sourceUrl: entry.sourceUrl ?? null,
    urls: {
      mihomo: entry.mihomoUrl,
      surge: entry.surgeUrl,
      quantumultx: entry.quantumultxUrl,
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
    moduleSupportedClients = supportedClients,
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
    supportedClients: moduleSupportedClients,
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
const serviceCheckGroupNames = serviceCheckGroups.map((group) => group.name);
const clashInlineRules = [
  "AND,((NETWORK,UDP),(DST-PORT,443)),REJECT",
];
const bootstrapDomainsByGroup = {
  AI平台: [
    "openai.com",
    "chatgpt.com",
  ],
  Claude: [
    "anthropic.com",
    "claude.ai",
  ],
  国外媒体: [
    "googlevideo.com",
    "youtube.com",
    "ytimg.com",
  ],
  即时通讯: [
    "telegram.org",
    "t.me",
    "discord.com",
    "discordapp.com",
    "whop.com",
  ],
  国外网站: [
    "google.com",
    "googleapis.com",
    "gstatic.com",
    "googleusercontent.com",
    "ggpht.com",
    "github.com",
    "githubusercontent.com",
    "githubassets.com",
    "npmjs.com",
    "docker.com",
    "pythonhosted.org",
    "gitlab.com",
    "x.com",
    "twitter.com",
  ],
};

function buildBootstrapRules(domainsByGroup) {
  return Object.entries(domainsByGroup).flatMap(([group, domains]) =>
    domains.map((domain) => ({
      rule: `DOMAIN-SUFFIX,${domain}`,
      group,
      origin: "bootstrap",
      sourceUrl: null,
    }))
  );
}

const globalBootstrapRules = buildBootstrapRules(bootstrapDomainsByGroup);
const aiRoutingRules = [
  "DOMAIN,ios.chat.openai.com",
  "DOMAIN,android.chat.openai.com",
  "DOMAIN-SUFFIX,auth.openai.com",
  "DOMAIN-SUFFIX,challenges.cloudflare.com",
  "DOMAIN-SUFFIX,workos.com",
  "DOMAIN-SUFFIX,statsigapi.net",
  "DOMAIN-SUFFIX,featuregates.org",
  "DOMAIN-SUFFIX,appattest.apple.com",
  "DOMAIN-SUFFIX,devicecheck.apple.com",
].map((rule) => ({
  rule,
  group: "AI平台",
  origin: "openai-docs",
  sourceUrl: "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps",
}));
const routingRules = [
  ...globalBootstrapRules,
  ...aiRoutingRules,
];

const baseModule = moduleTemplate({
  id: "base.core",
  layer: "base",
  domain: "core",
  title: "Core strategy scaffold",
  groups: uniq([
    ...strategyGroups.map((group) => group.name),
    ...serviceCheckGroupNames,
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
    groups: ["AI平台", "Claude"],
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
    groups: ["国外网站"],
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
    groups: ["国外网站"],
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
    id: "scenario.finance",
    layer: "scenario",
    domain: "finance",
    title: "Financial platforms",
    groups: ["金融网站"],
    ruleSets: ["longbridge", "ibkr", "tigerfintech"],
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
    ruleSets: ["google", "twitter", "github", "npmjs", "docker", "python", "gitlab", "scholar", "wikipedia", "stackexchange"],
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
    ruleSets: ["bilibili", "chinamedia"],
    dependsOn: ["base.core"],
    capabilities: {
      routing: true,
    },
  }),
  moduleTemplate({
    id: "scenario.bytedance",
    layer: "scenario",
    domain: "bytedance",
    title: "ByteDance employee direct routing",
    groups: ["字节跳动"],
    ruleSets: ["bytedance"],
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
const strategyGroupNames = strategyGroups.map((group) => group.name);
const policyGroupNames = uniq([
  ...strategyGroupNames,
  ...serviceCheckGroupNames,
  ...regionGroupNames,
  ...businessGroupNames,
]);
const stashPolicyGroupNames = uniq([
  ...strategyGroupNames,
  ...serviceCheckGroupNames,
  ...stashEnhancementGroups.map((group) => group.name),
  ...businessGroupNames,
  ...regionGroupNames,
]);
const quantumultxPolicyGroupNames = uniq([
  ...strategyGroupNames,
  ...serviceCheckGroupNames,
  ...quantumultxEnhancementGroups.map((group) => group.name),
  ...regionGroupNames,
  ...businessGroupNames,
]);

const clientModules = [
  moduleTemplate({
    id: "client.stash.entry",
    layer: "client",
    domain: "stash",
    title: "Stash entry override",
    dependsOn: entryComposition,
    groups: stashPolicyGroupNames,
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
    groups: policyGroupNames,
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
    id: "client.clash-party.entry",
    layer: "client",
    domain: "clash-party",
    title: "Clash Party remote override",
    dependsOn: entryComposition,
    groups: policyGroupNames,
    output: {
      path: "dist/mihomo/clash-party.js",
      format: "clash-party-override-js",
    },
    capabilities: {
      routing: true,
      rewrite: false,
      script: false,
      mitm: false,
    },
    notes: ["Rendered without CommonJS exports so Clash Party can import it as a remote JavaScript override."],
    moduleSupportedClients: ["clash-party"],
  }),
  moduleTemplate({
    id: "client.surge.entry",
    layer: "client",
    domain: "surge",
    title: "Surge entry module",
    dependsOn: entryComposition,
    groups: policyGroupNames,
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
  moduleTemplate({
    id: "client.quantumultx.entry",
    layer: "client",
    domain: "quantumultx",
    title: "Quantumult X lightweight lazy profile",
    dependsOn: entryComposition,
    groups: quantumultxPolicyGroupNames,
    output: {
      path: "dist/quantumultx/rules.conf",
      format: "quantumultx-profile",
    },
    capabilities: {
      routing: true,
      rewrite: false,
      script: false,
      mitm: false,
    },
    notes: [
      "Rendered as a public-safe lightweight lazy profile for policies and filters; server subscriptions are imported separately.",
    ],
  }),
  moduleTemplate({
    id: "client.quantumultx.sub-store",
    layer: "client",
    domain: "quantumultx",
    title: "Quantumult X Sub-Store optional addon",
    dependsOn: [],
    output: {
      path: "dist/quantumultx/sub-store.conf",
      format: "quantumultx-profile-addon",
    },
    capabilities: {
      routing: false,
      rewrite: true,
      script: true,
      mitm: false,
    },
    notes: [
      "Optional addon that imports Sub-Store official Quantumult X rewrite and task resources; not enabled by the default lightweight profile.",
    ],
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
    clashParty: {
      moduleId: "client.clash-party.entry",
      modules: entryComposition,
      outputPath: "dist/mihomo/clash-party.js",
      format: "clash-party-override-js",
    },
    surge: {
      moduleId: "client.surge.entry",
      modules: entryComposition,
      outputPath: "dist/surge/module.sgmodule",
      format: "surge-module",
    },
    surgeProxyGroups: {
      moduleId: "client.surge.entry",
      modules: entryComposition,
      outputPath: "dist/surge/proxy-groups.dconf",
      format: "surge-detached-proxy-groups",
    },
    surgeProxyGroupsCompact: {
      moduleId: "client.surge.entry",
      modules: entryComposition,
      outputPath: "dist/surge/proxy-groups.compact.dconf",
      format: "surge-detached-proxy-groups",
    },
    surgeRules: {
      moduleId: "client.surge.entry",
      modules: entryComposition,
      outputPath: "dist/surge/rules.dconf",
      format: "surge-detached-rules",
    },
    quantumultx: {
      moduleId: "client.quantumultx.entry",
      modules: entryComposition,
      outputPath: "dist/quantumultx/rules.conf",
      format: "quantumultx-profile",
    },
    quantumultxSubStore: {
      moduleId: "client.quantumultx.sub-store",
      modules: ["client.quantumultx.sub-store"],
      outputPath: "dist/quantumultx/sub-store.conf",
      format: "quantumultx-profile-addon",
    },
  };
}

function buildModuleIndex() {
  return {
    schemaVersion: 1,
    model: "unified-strategy-pack",
    defaultHealthCheck,
    strategyGroups,
    serviceCheckGroups,
    businessGroups,
    stashEnhancementGroups,
    stashPolicyChoices,
    quantumultxEnhancementGroups,
    quantumultxPolicyChoices,
    regions,
    ruleSets: normalizedRuleSets,
    routingRules,
    runtimeModules,
    runtimeSupportMatrix,
    clashInlineRules,
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
  serviceCheckGroups,
  businessGroups,
  stashEnhancementGroups,
  stashPolicyChoices,
  quantumultxEnhancementGroups,
  quantumultxPolicyChoices,
  rulesets: normalizedRuleSets,
  surgeRuleSetLocation,
};
