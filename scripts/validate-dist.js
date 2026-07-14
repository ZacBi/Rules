"use strict";

const fs = require("fs");

function readText(path) {
  return fs.readFileSync(path, "utf8");
}

function fail(errors) {
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

function sectionNames(text) {
  return [...text.matchAll(/^\[([^\]]+)\]$/gm)].map((match) => match[1]);
}

function validateQuantumultx() {
  const file = "dist/quantumultx/rules.conf";
  const text = readText(file);
  const errors = [];
  const required = [
    "general",
    "dns",
    "policy",
    "server_remote",
    "filter_remote",
    "rewrite_remote",
    "server_local",
    "filter_local",
    "rewrite_local",
    "task_local",
    "http_backend",
    "mitm",
  ];
  const sections = sectionNames(text);
  const positions = Object.fromEntries(sections.map((section, index) => [section, index]));

  for (const section of required) {
    if (!sections.includes(section)) {
      errors.push(`${file}: missing [${section}]`);
    }
  }

  for (let index = 1; index < required.length; index += 1) {
    if (positions[required[index - 1]] >= positions[required[index]]) {
      errors.push(`${file}: section order error, expected [${required[index - 1]}] before [${required[index]}]`);
    }
  }

  if (/geo_location_checker|resource_parser_url|network_check_url/.test(text)) {
    errors.push(`${file}: contains general URL key that should stay user-local`);
  }
  if (!/^server_check_url=https:\/\/www\.gstatic\.com\/generate_204$/m.test(text)) {
    errors.push(`${file}: missing baseline server_check_url`);
  }
  if (!/^server_check_timeout=3000$/m.test(text)) {
    errors.push(`${file}: missing baseline server_check_timeout`);
  }
  const emptyPublicSections = [
    ["server_remote", "filter_remote"],
    ["rewrite_remote", "server_local"],
    ["server_local", "filter_local"],
    ["rewrite_local", "task_local"],
    ["task_local", "http_backend"],
    ["http_backend", "mitm"],
  ];
  for (const [section, nextSection] of emptyPublicSections) {
    const block = text.match(new RegExp(`^\\[${section}\\]\\n([\\s\\S]*?)\\n\\[${nextSection}\\]$`, "m"));
    if (!block) {
      errors.push(`${file}: [${section}] must be present before [${nextSection}]`);
    } else if (block[1].trim()) {
      errors.push(`${file}: [${section}] must stay empty in the public profile`);
    }
  }
  if (!/^no-ipv6$/m.test(text)) {
    errors.push(`${file}: missing no-ipv6`);
  }
  if (!/^server=223\.5\.5\.5$/m.test(text) || !/^server=119\.29\.29\.29$/m.test(text)) {
    errors.push(`${file}: missing baseline DNS servers`);
  }
  if (!text.includes("FILTER_REGION") || !text.includes("FILTER_LAN")) {
    errors.push(`${file}: missing built-in FILTER_REGION/FILTER_LAN`);
  }
  if (/sub-store-org\/Sub-Store|QX\.snippet|QX-Task\.json/.test(text)) {
    errors.push(`${file}: Sub-Store addon must stay out of the default QX profile`);
  }
  const qxIconFiles = {
    全部节点: "Server.png",
    自动选择: "Speedtest.png",
    节点选择: "Auto.png",
    香港优先: "Hong_Kong.png",
    媒体轮询: "Media.png",
    国外媒体: "ForeignMedia.png",
    AI平台: "ChatGPT.png",
    国内网站: "China_Map.png",
    漏网之鱼: "Rocket.png",
  };
  for (const [group, iconFile] of Object.entries(qxIconFiles)) {
    const pattern = new RegExp(`^(?:static|available|round-robin|url-latency-benchmark)=${group},.*img-url=https://cdn\\.jsdelivr\\.net/gh/Koolson/Qure@master/IconSet/Color/${iconFile.replace(".", "\\.")}$`, "m");
    if (!pattern.test(text)) {
      errors.push(`${file}: missing expected Qure CDN img-url for ${group}`);
    }
  }
  if (!/^static=Claude,.*img-url=https:\/\/cdn\.jsdelivr\.net\/npm\/@lobehub\/icons-static-png@1\.91\.0\/light\/claude-color\.png$/m.test(text)) {
    errors.push(`${file}: missing Claude CDN icon`);
  }
  if (!/^static=金融网站,.*img-url=https:\/\/cdn\.jsdelivr\.net\/gh\/jdecked\/twemoji@main\/assets\/72x72\/1f3e6\.png$/m.test(text)) {
    errors.push(`${file}: missing finance CDN icon`);
  }
  if (!/^available=香港优先, server-tag-regex=/m.test(text)) {
    errors.push(`${file}: missing Quantumult X Hong Kong available policy`);
  }
  if (!/^round-robin=媒体轮询, server-tag-regex=/m.test(text)) {
    errors.push(`${file}: missing Quantumult X media round-robin policy`);
  }
  if (!/^static=节点选择, 香港优先,/m.test(text)) {
    errors.push(`${file}: 节点选择 should include Quantumult X Hong Kong helper`);
  }
  if (!/^static=国外媒体, 媒体轮询,/m.test(text)) {
    errors.push(`${file}: 国外媒体 should include Quantumult X media helper`);
  }

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    if (/blackmatrix7\/ios_rule_script/.test(line) && !line.includes("opt-parser=false")) {
      errors.push(`${file}:${lineNumber}: blackmatrix7 remote missing opt-parser=false`);
    }
    if (/^(?:static|available|round-robin|url-latency-benchmark)\s=/.test(line)) {
      errors.push(`${file}:${lineNumber}: policy assignment has space before "="`);
    }
    if (/^(DOMAIN|DOMAIN-SUFFIX|IP-CIDR|IP-CIDR6|FINAL),/.test(line)) {
      errors.push(`${file}:${lineNumber}: filter type should be lower-case`);
    }
  });

  return errors;
}

function validateQuantumultxSubStore() {
  const file = "dist/quantumultx/sub-store.conf";
  const text = readText(file);
  const errors = [];
  const sections = sectionNames(text);
  const required = ["rewrite_remote", "task_local"];

  for (const section of required) {
    if (!sections.includes(section)) {
      errors.push(`${file}: missing [${section}]`);
    }
  }
  if (!text.includes("https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/QX.snippet")) {
    errors.push(`${file}: missing Sub-Store QX rewrite snippet`);
  }
  if (!text.includes("https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/QX-Task.json")) {
    errors.push(`${file}: missing Sub-Store QX task resource`);
  }
  if (/\/download\/|\/api\/|SUB_STORE|Bearer|Cookie|\/Users\/zacbi|api_key|password|secret|token/i.test(text)) {
    errors.push(`${file}: contains private or instance-specific Sub-Store marker`);
  }

  return errors;
}

function validateSurge() {
  const file = "dist/surge/module.sgmodule";
  const text = readText(file);
  const errors = [];
  const required = ["General", "Proxy Group", "Rule"];
  const sections = sectionNames(text);

  for (const section of required) {
    if (!sections.includes(section)) {
      errors.push(`${file}: missing [${section}]`);
    }
  }
  if (!/^# Generated from the unified strategy model$/m.test(text)) {
    errors.push(`${file}: missing generated header`);
  }
  if (!/^全部节点 = select,/m.test(text) || !/^自动选择 = url-test,/m.test(text)) {
    errors.push(`${file}: missing core proxy groups`);
  }
  if (!/^FINAL,漏网之鱼$/m.test(text)) {
    errors.push(`${file}: missing FINAL rule`);
  }
  if (/policy-path=|Bearer|Cookie|\/Users\/zacbi|api_key|password|secret|token/i.test(text)) {
    errors.push(`${file}: contains forbidden public module marker`);
  }

  const proxyGroupsFile = "dist/surge/proxy-groups.dconf";
  const proxyGroupsText = readText(proxyGroupsFile);
  if (/^\[Proxy Group\]$/m.test(proxyGroupsText)) {
    errors.push(`${proxyGroupsFile}: standalone include must not contain [Proxy Group]`);
  }
  if (!/^节点选择 = select,/m.test(proxyGroupsText) || /hidden=true/.test(proxyGroupsText)) {
    errors.push(`${proxyGroupsFile}: expected full visible proxy groups`);
  }

  const compactProxyGroupsFile = "dist/surge/proxy-groups.compact.dconf";
  const compactProxyGroupsText = readText(compactProxyGroupsFile);
  if (/^\[Proxy Group\]$/m.test(compactProxyGroupsText)) {
    errors.push(`${compactProxyGroupsFile}: standalone include must not contain [Proxy Group]`);
  }
  if (!/^节点选择 = select,/m.test(compactProxyGroupsText) || !/^香港节点 = .*hidden=true$/m.test(compactProxyGroupsText)) {
    errors.push(`${compactProxyGroupsFile}: missing compact hidden proxy groups`);
  }

  const rulesFile = "dist/surge/rules.dconf";
  const rulesText = readText(rulesFile);
  if (/^\[Rule\]$/m.test(rulesText)) {
    errors.push(`${rulesFile}: standalone include must not contain [Rule]`);
  }
  if (!/^RULE-SET,LAN,DIRECT$/m.test(rulesText) || !/^FINAL,漏网之鱼$/m.test(rulesText)) {
    errors.push(`${rulesFile}: missing core Surge rules`);
  }

  return errors;
}

function validateStash() {
  const file = "dist/stash/stash.stoverride";
  const text = readText(file);
  const errors = [];

  for (const key of ["proxy-groups: #!replace", "rules: #!replace", "rule-providers:"]) {
    if (!text.includes(key)) {
      errors.push(`${file}: missing ${key}`);
    }
  }
  if (!/name: Rules 策略分流/.test(text)) {
    errors.push(`${file}: missing profile metadata name`);
  }
  if (!/type: url-test/.test(text) || !/name: "自动选择"/.test(text)) {
    errors.push(`${file}: missing automatic url-test group`);
  }
  if (!/name: "香港优先"[\s\S]*?type: fallback/.test(text)) {
    errors.push(`${file}: missing Stash Hong Kong fallback group`);
  }
  if (!/name: "香港优先"[\s\S]*?hidden: true/.test(text)) {
    errors.push(`${file}: Stash Hong Kong fallback group should stay hidden`);
  }
  if (!/name: "媒体负载均衡"[\s\S]*?type: load-balance[\s\S]*?strategy: consistent-hashing/.test(text)) {
    errors.push(`${file}: missing Stash media load-balance group`);
  }
  if (!/name: "媒体负载均衡"[\s\S]*?hidden: true/.test(text)) {
    errors.push(`${file}: Stash media load-balance group should stay hidden`);
  }
  if (/name: "节点选择"[\s\S]*?proxies:\n(?:      - "[^"]+"\n)*?      - "香港优先"/.test(text)) {
    errors.push(`${file}: 节点选择 should not default to Hong Kong fallback`);
  }
  if (!/name: "国外媒体"[\s\S]*?proxies:\n      - "节点选择"\n      - "自动选择"\n      - "媒体负载均衡"/.test(text)) {
    errors.push(`${file}: 国外媒体 should keep media load-balance as a secondary option`);
  }
  if (!/name: "Claude"[\s\S]*?icon: "https:\/\/unpkg\.com\/@lobehub\/icons-static-png@1\.91\.0\/light\/claude-color\.png"/.test(text)) {
    errors.push(`${file}: missing Claude dedicated icon`);
  }
  const stashIconFiles = {
    全部节点: "Server.png",
    AI平台: "ChatGPT.png",
    国内网站: "China_Map.png",
    漏网之鱼: "Rocket.png",
  };
  for (const [group, iconFile] of Object.entries(stashIconFiles)) {
    const pattern = new RegExp(`name: "${group}"[\\s\\S]*?icon: "https://raw\\.githubusercontent\\.com/Koolson/Qure/master/IconSet/Color/${iconFile.replace(".", "\\.")}"`);
    if (!pattern.test(text)) {
      errors.push(`${file}: missing expected icon for ${group}`);
    }
  }
  if (!/name: "金融网站"[\s\S]*?icon: "https:\/\/raw\.githubusercontent\.com\/jdecked\/twemoji\/main\/assets\/72x72\/1f3e6\.png"/.test(text)) {
    errors.push(`${file}: missing finance bank icon`);
  }
  if (!/MATCH,漏网之鱼/.test(text)) {
    errors.push(`${file}: missing MATCH fallback rule`);
  }
  if (/Bearer|Cookie|\/Users\/zacbi|api_key|password|secret|token/i.test(text)) {
    errors.push(`${file}: contains private marker`);
  }

  return errors;
}

function validateMihomo() {
  const files = ["dist/mihomo/override.js", "dist/mihomo/clash-party.js"];
  const errors = [];

  for (const file of files) {
    const text = readText(file);
    if (!/const MODULE_INDEX = /.test(text)) {
      errors.push(`${file}: missing MODULE_INDEX`);
    }
    if (!/function main\(config = \{\}\)/.test(text)) {
      errors.push(`${file}: missing main(config) override function`);
    }
    if (file.endsWith("override.js") && !/module\.exports = \{\s*main,\s*MODULE_INDEX,\s*\}/m.test(text)) {
      errors.push(`${file}: missing override export`);
    }
    if (file.endsWith("clash-party.js") && /module\.exports/.test(text)) {
      errors.push(`${file}: Clash Party override should not use CommonJS exports`);
    }
    if (!/"quantumultx": \{/.test(text) || !/"outputPath": "dist\/quantumultx\/rules\.conf"/.test(text)) {
      errors.push(`${file}: missing Quantumult X entrypoint metadata`);
    }
    if (/Bearer|Cookie|\/Users\/zacbi|api_key|password|secret|token/i.test(text)) {
      errors.push(`${file}: contains private marker`);
    }
  }

  return errors;
}

function sameItems(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return left.length === leftSet.size
    && right.length === rightSet.size
    && left.length === right.length
    && left.every((item) => rightSet.has(item));
}

function validateModuleIndexGroups() {
  const file = "dist/modules/index.json";
  const index = JSON.parse(readText(file));
  const errors = [];
  const strategyGroups = index.strategyGroups.map((group) => group.name);
  const baseGroups = [
    ...strategyGroups,
    ...index.serviceCheckGroups.map((group) => group.name),
    ...index.regions.map((region) => region.groupName),
    ...index.businessGroups.map((group) => group.name),
  ];
  const mihomoGroups = [
    ...strategyGroups,
    ...index.serviceCheckGroups.map((group) => group.name),
    ...index.stashEnhancementGroups.map((group) => group.name),
    ...index.regions.map((region) => region.groupName),
    ...index.businessGroups.map((group) => group.name),
  ];
  const stashGroups = [
    ...strategyGroups,
    ...index.serviceCheckGroups.map((group) => group.name),
    ...index.stashEnhancementGroups.map((group) => group.name),
    ...index.businessGroups.map((group) => group.name),
    ...index.regions.map((region) => region.groupName),
  ];
  const quantumultxGroups = [
    ...strategyGroups,
    ...index.serviceCheckGroups.map((group) => group.name),
    ...index.quantumultxEnhancementGroups.map((group) => group.name),
    ...index.regions.map((region) => region.groupName),
    ...index.businessGroups.map((group) => group.name),
  ];
  const expectations = {
    "client.stash.entry": stashGroups,
    "client.mihomo.entry": mihomoGroups,
    "client.clash-party.entry": mihomoGroups,
    "client.surge.entry": baseGroups,
    "client.quantumultx.entry": quantumultxGroups,
  };
  const modulesById = new Map(index.modules.map((module) => [module.id, module]));

  for (const [id, expected] of Object.entries(expectations)) {
    const module = modulesById.get(id);
    if (!module) {
      errors.push(`${file}: missing ${id}`);
      continue;
    }
    if (!sameItems(module.groups, expected)) {
      errors.push(`${file}: ${id} group metadata does not match generated policy groups`);
    }
  }

  return errors;
}

function validatePublicSafety() {
  const files = [
    "dist/quantumultx/rules.conf",
    "dist/quantumultx/sub-store.conf",
    "dist/surge/module.sgmodule",
    "dist/surge/proxy-groups.dconf",
    "dist/surge/proxy-groups.compact.dconf",
    "dist/surge/rules.dconf",
    "dist/stash/stash.stoverride",
    "dist/mihomo/override.js",
    "dist/mihomo/clash-party.js",
    "dist/modules/index.json",
  ];
  const errors = [];
  const pattern = /Bearer|Cookie|\/Users\/zacbi|api_key|password|secret|token/i;

  for (const file of files) {
    const text = readText(file);
    if (pattern.test(text)) {
      errors.push(`${file}: contains private marker`);
    }
  }

  return errors;
}

function main() {
  const checks = {
    quantumultx: validateQuantumultx,
    quantumultxSubStore: validateQuantumultxSubStore,
    surge: validateSurge,
    stash: validateStash,
    mihomo: validateMihomo,
    moduleIndexGroups: validateModuleIndexGroups,
    public: validatePublicSafety,
  };
  const requested = process.argv.slice(2);
  const names = requested.length ? requested : Object.keys(checks);
  const errors = [];

  for (const name of names) {
    const check = checks[name];
    if (!check) {
      errors.push(`Unknown validation target: ${name}`);
      continue;
    }
    errors.push(...check());
  }

  fail(errors);
  console.log(`Validated dist targets: ${names.join(", ")}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateQuantumultx,
  validateSurge,
  validateStash,
  validateMihomo,
  validateModuleIndexGroups,
  validatePublicSafety,
};
