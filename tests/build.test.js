const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

test("build emits modular artifacts and index for all clients", () => {
  fs.rmSync(distDir, { recursive: true, force: true });

  execFileSync("node", ["scripts/build.js"], {
    cwd: rootDir,
    stdio: "pipe",
  });

  assert.equal(exists("dist/modules/index.json"), true);
  assert.equal(exists("dist/stash/stash.stoverride"), true);
  assert.equal(exists("dist/mihomo/override.js"), true);
  assert.equal(exists("dist/mihomo/clash-party.js"), true);
  assert.equal(exists("dist/surge/module.sgmodule"), true);
  assert.equal(exists("dist/quantumultx/rules.conf"), true);

  const index = JSON.parse(read("dist/modules/index.json"));
  assert.equal(Array.isArray(index.modules), true);
  assert.equal(index.modules.some((module) => module.id === "base.core"), true);
  assert.equal(index.modules.some((module) => module.id === "client.stash.entry"), true);
  assert.equal(index.modules.some((module) => module.id === "client.mihomo.entry"), true);
  assert.equal(index.modules.some((module) => module.id === "client.clash-party.entry"), true);
  assert.equal(index.modules.some((module) => module.id === "client.surge.entry"), true);
});

test("build outputs metadata for routing and policy-pack capabilities", () => {
  const index = JSON.parse(read("dist/modules/index.json"));
  const baseCore = index.modules.find((module) => module.id === "base.core");
  const aiScenario = index.modules.find((module) => module.id === "scenario.ai");
  const runtimeModule = index.runtimeModules && index.runtimeModules.find((module) => module.id === "runtime.ai.assistant");

  assert.ok(baseCore);
  assert.equal(baseCore.layer, "base");
  assert.deepEqual(baseCore.supportedClients, ["stash", "mihomo", "surge", "quantumultx"]);
  assert.equal(baseCore.capabilities.routing, true);
  assert.equal(baseCore.capabilities.rewrite, true);
  assert.equal(baseCore.capabilities.script, true);
  assert.equal(baseCore.capabilities.mitm, true);

  assert.ok(aiScenario);
  assert.equal(aiScenario.domain, "ai");
  assert.equal(aiScenario.ruleSets.includes("openai"), true);
  assert.equal(aiScenario.ruleSets.includes("anthropic"), true);
  assert.equal(aiScenario.ruleSets.includes("gemini"), true);
  assert.deepEqual(index.serviceCheckGroups, []);

  assert.ok(runtimeModule);
  assert.equal(runtimeModule.kind, "script");
  assert.equal(runtimeModule.sourceMode, "unresolved");
  assert.equal(runtimeModule.emitByDefault, false);
  assert.equal(runtimeModule.support.supportLevel.stash, "partial");
  assert.equal(runtimeModule.support.supportLevel.mihomo, "unsupported");
  assert.equal(runtimeModule.support.supportLevel.quantumultx, "metadata-only");

  const clients = Object.keys(index.runtimeSupportMatrix).sort();
  for (const module of index.runtimeModules) {
    assert.deepEqual(Object.keys(module.support.supportLevel).sort(), clients);
    assert.deepEqual(Object.keys(module.support.notes).sort(), clients);
    assert.deepEqual(
      [...module.supportedClients].sort(),
      clients.filter((client) => module.support.supportLevel[client] !== "unsupported")
    );
  }
});

test("generated client entrypoints use modular outputs instead of private subscription templates", () => {
  const stash = read("dist/stash/stash.stoverride");
  const mihomo = read("dist/mihomo/override.js");
  const clashParty = read("dist/mihomo/clash-party.js");
  const surge = read("dist/surge/module.sgmodule");
  const quantumultx = read("dist/quantumultx/rules.conf");

  assert.match(stash, /^name: Rules 策略分流$/m);
  assert.match(stash, /^desc: Stash iOS 轻量策略组与规则集入口。$/m);
  assert.match(stash, /^homepage: https:\/\/github\.com\/ZacBi\/Rules$/m);
  assert.match(stash, /^category: Policy$/m);
  assert.match(stash, /DOMAIN-SUFFIX,googleapis\.com,国外网站/);
  assert.match(stash, /DOMAIN-SUFFIX,github\.com,国外网站/);
  assert.match(stash, /DOMAIN-SUFFIX,openai\.com,AI平台/);
  assert.match(stash, /DOMAIN-SUFFIX,youtube\.com,国外媒体/);
  assert.doesNotMatch(stash, /\[object Object\]/);
  assert.doesNotMatch(stash, /\ndns:\n/);
  assert.doesNotMatch(stash, /default-nameserver: #!replace/);
  assert.doesNotMatch(stash, /nameserver: #!replace/);
  assert.doesNotMatch(stash, /follow-rule: true/);
  assert.match(stash, /^proxy-groups: #!replace$/m);
  assert.match(stash, /^rule-providers: #!replace$/m);
  assert.match(stash, /^rules: #!replace$/m);
  assert.doesNotMatch(stash, /^http:$/m);
  assert.doesNotMatch(stash, /^script-providers:$/m);
  assert.doesNotMatch(stash, /__MIHOMO_SUBSCRIPTION_URL__/);

  assert.match(mihomo, /const MODULE_INDEX =/);
  assert.match(mihomo, /url-test/);
  assert.doesNotMatch(mihomo, /proxy-providers:/);
  assert.match(clashParty, /function main\(config = \{\}\)/);
  assert.match(clashParty, /url-test/);
  assert.doesNotMatch(clashParty, /module\.exports/);

  assert.match(surge, /\[Rule\]/);
  assert.doesNotMatch(surge, /\[URL Rewrite\]/);
  assert.doesNotMatch(surge, /\[Script\]/);
  assert.doesNotMatch(surge, /\[MITM\]/);
  assert.doesNotMatch(surge, /__SURGE_POLICY_PATH__/);

  assert.match(quantumultx, /^\[general\]\n\n\[dns\]\n\n\[policy\]$/m);
  assert.match(quantumultx, /^url-latency-benchmark=自动选择,/m);
});

test("stash entry keeps subscription-backed proxy groups", () => {
  const stash = read("dist/stash/stash.stoverride");

  assert.match(stash, /name: "自动选择"|name: 自动选择/);
  assert.match(stash, /name: "节点选择"|name: 节点选择/);
  assert.doesNotMatch(stash, /Rules-/);
  assert.match(stash, /type: url-test/);
  assert.doesNotMatch(stash, /name: "AI 自动"/);
  assert.doesNotMatch(stash, /name: "Gemini 自动"/);
  assert.doesNotMatch(stash, /name: "Google 自动"/);
  assert.match(stash, /name: "国外网站"[\s\S]{0,180}?\n\s+- "节点选择"/);
  assert.match(stash, /RULE-SET,gemini,AI平台/);
  assert.match(stash, /AND,\(\(NETWORK,UDP\),\(DST-PORT,443\)\),REJECT/);
  assert.match(stash, /include-all: true/);
  assert.match(stash, /filter:/);
  assert.match(stash, /interval: 600/);
  assert.match(stash, /tolerance: 100/);
  assert.doesNotMatch(stash, /节点选择\n\s+type: select\n\s+proxies:\n\s+- DIRECT/);
});

test("stash entry assigns semantic qure icons to major groups", () => {
  const stash = read("dist/stash/stash.stoverride");

  assert.match(stash, /name: "自动选择"\n\s+type: url-test\n\s+icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Speedtest\.png"/);
  assert.match(stash, /name: "节点选择"\n\s+type: select\n\s+icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Auto\.png"/);
  assert.match(stash, /name: "香港优先"\n\s+type: fallback\n\s+icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Hong_Kong\.png"/);
  assert.match(stash, /name: "媒体负载均衡"\n\s+type: load-balance\n\s+icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Media\.png"[\s\S]{0,1200}?strategy: consistent-hashing/);
  assert.match(stash, /name: "香港节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Hong_Kong\.png"/);
  assert.match(stash, /name: "台湾节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Taiwan\.png"/);
  assert.match(stash, /name: "日本节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Japan\.png"/);
  assert.match(stash, /name: "新加坡节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Singapore\.png"/);
  assert.match(stash, /name: "美国节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/United_States_Map\.png"/);
  assert.match(stash, /name: "英国节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/United_Kingdom\.png"/);
  assert.match(stash, /name: "澳洲节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Australia\.png"/);
  assert.match(stash, /name: "马来西亚节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Malaysia\.png"/);
  assert.match(stash, /name: "阿根廷节点"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Argentina\.png"/);
  assert.match(stash, /name: "AI平台"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/ChatGPT\.png"/);
  assert.match(stash, /name: "Claude"[\s\S]{0,140}?icon: "https:\/\/unpkg\.com\/@lobehub\/icons-static-png@1\.91\.0\/light\/claude-color\.png"/);
  assert.doesNotMatch(stash, /name: "Gemini"\n/);
  assert.match(stash, /name: "国外媒体"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/ForeignMedia\.png"/);
  assert.doesNotMatch(stash, /name: "开发工具"/);
  assert.doesNotMatch(stash, /name: "学习研究"/);
  assert.match(stash, /name: "即时通讯"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Telegram\.png"/);
  assert.match(stash, /name: "微软服务"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Microsoft\.png"/);
  assert.match(stash, /name: "苹果服务"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Apple_2\.png"/);
  assert.match(stash, /name: "游戏平台"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Game\.png"/);
  assert.match(stash, /name: "金融网站"[\s\S]{0,140}?icon: "https:\/\/raw\.githubusercontent\.com\/jdecked\/twemoji\/main\/assets\/72x72\/1f3e6\.png"/);
  assert.match(stash, /name: "国外网站"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Global\.png"/);
  assert.match(stash, /name: "国内网站"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/China_Map\.png"/);
  assert.match(stash, /name: "广告拦截"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Advertising\.png"/);
  assert.match(stash, /name: "漏网之鱼"[\s\S]{0,120}?icon: "https:\/\/raw\.githubusercontent\.com\/Koolson\/Qure\/master\/IconSet\/Color\/Rocket\.png"/);
});

test("surge entry includes existing proxies and keeps real rule-set urls", () => {
  const surge = read("dist/surge/module.sgmodule");

  assert.match(surge, /policy-regex-filter=/);
  assert.match(surge, /include-all-proxies=true/);
  assert.match(surge, /interval=600/);
  assert.match(surge, /timeout=3/);
  assert.match(surge, /RULE-SET,https:\/\/raw\.githubusercontent\.com\/blackmatrix7\/ios_rule_script\/master\/rule\/Surge\/OpenAI\/OpenAI\.list,AI平台,extended-matching/);
  assert.match(surge, /RULE-SET,https:\/\/raw\.githubusercontent\.com\/blackmatrix7\/ios_rule_script\/master\/rule\/Surge\/Gemini\/Gemini\.list,AI平台,extended-matching/);
  assert.match(surge, /RULE-SET,https:\/\/raw\.githubusercontent\.com\/blackmatrix7\/ios_rule_script\/master\/rule\/Surge\/GitHub\/GitHub\.list,国外网站,extended-matching/);
  assert.doesNotMatch(surge, /Google检测 = url-test/);
  assert.doesNotMatch(surge, /RULE-SET,openai,AI 平台,extended-matching/);
});

test("client entries keep Claude proxy choices consistent", () => {
  const stash = read("dist/stash/stash.stoverride");
  const surge = read("dist/surge/module.sgmodule");
  const index = JSON.parse(read("dist/modules/index.json"));
  const { main } = require(path.join(rootDir, "dist/mihomo/override.js"));
  const expectedProxies = index.businessGroups.find((group) => group.name === "Claude").proxies;
  const stashClaudeBlock = stash.match(/  - name: "Claude"\n[\s\S]*?(?=\n  - name: "即时通讯")/)[0];
  const mihomoClaudeGroup = main({ proxies: [] })["proxy-groups"].find((group) => group.name === "Claude");

  assert.deepEqual(expectedProxies, [
    "节点选择",
    "自动选择",
    "全部节点",
    "香港节点",
    "台湾节点",
    "日本节点",
    "新加坡节点",
    "美国节点",
    "英国节点",
    "澳洲节点",
    "马来西亚节点",
    "阿根廷节点",
  ]);
  assert.match(surge, new RegExp(`^Claude = select, ${expectedProxies.join(", ")}$`, "m"));
  for (const proxy of expectedProxies) {
    assert.match(stashClaudeBlock, new RegExp(`\\n\\s+- "${proxy}"`));
  }
  assert.deepEqual(mihomoClaudeGroup.proxies, expectedProxies);
});

test("stash entry keeps runtime modules opt-in without example artifacts", () => {
  const stash = read("dist/stash/stash.stoverride");
  const surge = read("dist/surge/module.sgmodule");
  const index = JSON.parse(read("dist/modules/index.json"));
  const runtimeModules = index.runtimeModules || [];
  const trackingRewrite = runtimeModules.find((module) => module.id === "runtime.media.unlock");
  const upgradeRewrite = runtimeModules.find((module) => module.id === "runtime.app.upgrade-check");
  const testFlightScript = runtimeModules.find((module) => module.id === "runtime.apple.testflight-download");

  assert.equal(runtimeModules.some((module) => module.id === "runtime.ai.assistant"), true);
  assert.equal(runtimeModules.every((module) => module.sourceMode !== "local" || module.id !== "runtime.apple.testflight-download"), true);
  assert.equal(index.modules.some((module) => module.id === "client.stash.runtime-example"), false);
  assert.equal(Object.hasOwn(index.entrypoints, "stashRuntimeExample"), false);
  assert.ok(trackingRewrite);
  assert.equal(trackingRewrite.support.supportLevel.stash, "partial");
  assert.deepEqual(trackingRewrite.render, {});
  assert.ok(upgradeRewrite);
  assert.equal(upgradeRewrite.emitByDefault, false);
  assert.match(upgradeRewrite.sourceUrl, /blackmatrix7\/ios_rule_script/);
  assert.doesNotMatch(stash, /google-no-country-redirect/);
  assert.ok(testFlightScript);
  assert.equal(testFlightScript.emitByDefault, false);
  assert.match(testFlightScript.render.stashScript.url, /blackmatrix7\/ios_rule_script/);

  assert.doesNotMatch(stash, /reject-tracking/);
  assert.doesNotMatch(stash, /assistant-panel/);
  assert.equal(exists("dist/stash/runtime.example.stoverride"), false);

  assert.doesNotMatch(surge, /\[URL Rewrite\]/);
  assert.doesNotMatch(surge, /\[Script\]/);
  assert.doesNotMatch(surge, /assistant-panel/);
  assert.doesNotMatch(surge, /Reserved for rewrite modules/);
});

test("mihomo entry exposes runtime capability downgrades instead of fake output", () => {
  const mihomo = read("dist/mihomo/override.js");
  const clashParty = read("dist/mihomo/clash-party.js");
  const index = JSON.parse(read("dist/modules/index.json"));

  assert.match(mihomo, /runtimeSupport/);
  assert.doesNotMatch(mihomo, /mitm:/);
  assert.match(clashParty, /runtimeSupport/);
  assert.doesNotMatch(clashParty, /mitm:/);
  assert.equal(index.entrypoints.clashParty.outputPath, "dist/mihomo/clash-party.js");
  assert.equal(index.runtimeSupportMatrix.stash.script, "full");
  assert.equal(index.runtimeSupportMatrix.surge.rewrite, "full");
  assert.equal(index.runtimeSupportMatrix.mihomo.rewrite, "unsupported");
  assert.equal(index.runtimeSupportMatrix.mihomo.script, "unsupported");
});

test("default build does not ship placeholder repository urls", () => {
  const stash = read("dist/stash/stash.stoverride");
  const mihomo = read("dist/mihomo/override.js");
  const clashParty = read("dist/mihomo/clash-party.js");
  const surge = read("dist/surge/module.sgmodule");
  const index = read("dist/modules/index.json");

  assert.doesNotMatch(stash, /YOUR_GITHUB_USER\/Rules/);
  assert.doesNotMatch(mihomo, /YOUR_GITHUB_USER\/Rules/);
  assert.doesNotMatch(clashParty, /YOUR_GITHUB_USER\/Rules/);
  assert.doesNotMatch(surge, /YOUR_GITHUB_USER\/Rules/);
  assert.doesNotMatch(index, /YOUR_GITHUB_USER\/Rules/);
});

test("mihomo region groups avoid substring false positives", () => {
  const { main } = require(path.join(rootDir, "dist/mihomo/override.js"));
  const config = main({
    proxies: [
      "Australia-01",
      "Russia-01",
      "Paris-01",
      "Saudi Arabia-01",
      "US-01",
      "AR-01",
    ].map((name) => ({ name })),
  });
  const groups = new Map(config["proxy-groups"].map((group) => [group.name, group.proxies]));

  assert.deepEqual(groups.get("美国节点"), ["US-01"]);
  assert.deepEqual(groups.get("澳洲节点"), ["Australia-01"]);
  assert.deepEqual(groups.get("阿根廷节点"), ["AR-01"]);
});

test("mihomo generated policy groups stay acyclic with partial subscriptions", () => {
  const { main } = require(path.join(rootDir, "dist/mihomo/override.js"));

  for (const proxies of [[], [{ name: "HK-01" }], [{ name: "US-01" }, { name: "JP-01" }]]) {
    const groups = main({ proxies })["proxy-groups"];
    const groupNames = new Set(groups.map((group) => group.name));
    const references = new Map(
      groups.map((group) => [group.name, (group.proxies || []).filter((proxy) => groupNames.has(proxy))])
    );

    function visit(name, stack = []) {
      assert.equal(stack.includes(name), false, `policy group cycle: ${[...stack, name].join(" -> ")}`);
      for (const referenced of references.get(name) || []) {
        visit(referenced, [...stack, name]);
      }
    }

    for (const group of groups) {
      visit(group.name);
    }
  }
});

test("mihomo excludes subscription status pseudo-nodes", () => {
  const { main } = require(path.join(rootDir, "dist/mihomo/override.js"));
  const config = main({
    proxies: [
      { name: "香港 01" },
      { name: "剩余流量 100 GB" },
      { name: "Expire 2027-01-01" },
    ],
  });
  const all = config["proxy-groups"].find((group) => group.name === "全部节点");

  assert.deepEqual(all.proxies, ["香港 01"]);
});

test("public entries do not override user-local network settings", () => {
  const stash = read("dist/stash/stash.stoverride");
  const surge = read("dist/surge/module.sgmodule");
  const quantumultx = read("dist/quantumultx/rules.conf");

  assert.doesNotMatch(stash, /^(mixed-port|allow-lan|mode|log-level|ipv6):/m);
  assert.doesNotMatch(surge, /^\[General\]$/m);
  assert.doesNotMatch(quantumultx, /^(server_check_url|server_check_timeout|no-ipv6|server=)/m);
});

test("default Stash entry stays policy-only and shared domains avoid AI routing", () => {
  const stash = read("dist/stash/stash.stoverride");

  assert.doesNotMatch(stash, /^http:$/m);
  assert.doesNotMatch(stash, /^script-providers:$/m);
  assert.doesNotMatch(stash, /app-upgrade-check-block|testflight-download-fix|google-no-country-redirect/);
  assert.doesNotMatch(stash, /DOMAIN-SUFFIX,(challenges\.cloudflare\.com|workos\.com|statsigapi\.net|featuregates\.org|appattest\.apple\.com|devicecheck\.apple\.com),AI平台/);
});

test("CI runs tests and stages every generated artifact", () => {
  const workflow = read(".github/workflows/build-dist.yml");

  assert.match(workflow, /- "tests\/\*\*"/);
  assert.match(workflow, /- "dist\/\*\*"/);
  assert.match(workflow, /run: node --test/);
  assert.match(workflow, /git add -- dist/);
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.match(workflow, /zricethezav\/gitleaks@sha256:[a-f0-9]{64}/);
  for (const line of workflow.split(/\r?\n/).filter((entry) => entry.trim().startsWith("uses:"))) {
    assert.match(line, /@[a-f0-9]{40}(?:\s+#.*)?$/);
  }
  assert.doesNotMatch(read(".gitignore"), /^tests\/$/m);
});

test("optional remote runtime code is pinned to immutable revisions", () => {
  const index = JSON.parse(read("dist/modules/index.json"));
  const remoteUrls = index.runtimeModules.flatMap((module) => [
    module.sourceUrl,
    module.render && module.render.stashScript && module.render.stashScript.url,
  ]).filter((url) => url && url.includes("raw.githubusercontent.com/blackmatrix7/ios_rule_script"));

  assert.equal(remoteUrls.length > 0, true);
  for (const url of remoteUrls) {
    assert.match(url, /ios_rule_script\/[a-f0-9]{40}\//);
    assert.doesNotMatch(url, /ios_rule_script\/master\//);
  }
});

test("project rule lists stay normalized and legacy inputs stay removed", () => {
  assert.equal(exists("rules/alibaba.list"), false);
  assert.equal(exists(".env.example"), false);
  assert.doesNotMatch(read("policy/catalog.js"), /RULES_GITHUB_REPO|Cursor/);

  for (const name of ["longbridge", "ibkr"]) {
    const listRules = read(`rules/${name}.list`).split(/\r?\n/).filter((line) => line && !line.startsWith("#"));
    const yamlRules = read(`rules/${name}.yaml`).split(/\r?\n/).filter((line) => /^\s+- /.test(line)).map((line) => line.replace(/^\s+- /, ""));

    assert.deepEqual(yamlRules, listRules);
    assert.equal(new Set(listRules).size, listRules.length);
  }
});
