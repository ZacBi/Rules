"use strict";

/**
 * Raw 地址里的 GitHub owner/repo（仅影响本仓库托管的规则集，如 Cursor）。
 * 发布前可执行：`RULES_GITHUB_REPO=你的用户名/Rules node scripts/build.js`
 * 不设则使用占位符，避免在公开仓库里硬编码个人 GitHub 账号。
 */
const RULES_GITHUB_REPO = process.env.RULES_GITHUB_REPO || "YOUR_GITHUB_USER/Rules";
const RULES_RAW_BASE = `https://raw.githubusercontent.com/${RULES_GITHUB_REPO}/master`;

const rulesets = [
  {
    key: "advertising",
    sourceName: "Advertising",
    group: "广告拦截",
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
    key: "cursor",
    sourceName: "Cursor",
    group: "AI平台",
    behavior: "classical",
    mihomoUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.yaml`,
    mihomoPath: "./ruleset/Cursor.yaml",
    surgeUrl: `${RULES_RAW_BASE}/mihomo/ruleset/Cursor.list`,
    /** When RULES_GITHUB_REPO is still the placeholder, raw GitHub URL is invalid — use repo file beside surge/*.conf. */
    surgeLocalRelativeToSurgeDir: "../mihomo/ruleset/Cursor.list",
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
    group: "AI平台",
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
  {
    key: "lan",
    sourceName: "Lan",
    group: "国内网站",
    behavior: "classical",
  },
  {
    key: "chinamedia",
    sourceName: "ChinaMedia",
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
];

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

function surgeRuleSetLocation(ruleset) {
  if (
    ruleset.surgeLocalRelativeToSurgeDir &&
    RULES_GITHUB_REPO === "YOUR_GITHUB_USER/Rules"
  ) {
    return ruleset.surgeLocalRelativeToSurgeDir;
  }
  return ruleset.surgeUrl;
}

module.exports = {
  rulesets: rulesets.map(withDerivedUrls),
  surgeRuleSetLocation,
};

