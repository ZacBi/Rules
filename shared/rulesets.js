"use strict";

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
    key: "gemini",
    sourceName: "Gemini",
    group: "AI平台",
    behavior: "classical",
  },
  {
    key: "copilot",
    sourceName: "Copilot",
    group: "开发平台",
    behavior: "classical",
  },
  {
    key: "cursor",
    sourceName: "Cursor",
    group: "开发平台",
    behavior: "classical",
    mihomoUrl:
      "https://raw.githubusercontent.com/ZacBi/Rules/master/mihomo/ruleset/Cursor.yaml",
    mihomoPath: "./ruleset/Cursor.yaml",
    surgeUrl:
      "https://raw.githubusercontent.com/ZacBi/Rules/master/mihomo/ruleset/Cursor.list",
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
    group: "开发平台",
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

module.exports = {
  rulesets: rulesets.map(withDerivedUrls),
};

