// FlClash / Mihomo 覆写脚本
// 目标：按业务组分流，并全部使用 Blackmatrix7 规则集
// 使用方式：订阅 -> 覆写 -> 脚本 -> 选择本脚本

const main = (config) => {
    config.proxies ??= [];
    config["proxy-groups"] ??= [];
    config["rule-providers"] ??= {};
    config.rules ??= [];

    const allProxyNames = config.proxies.map((p) => p.name).filter(Boolean);

    const uniq = (arr) => [...new Set(arr.filter(Boolean))];

    const matchNames = (re) => allProxyNames.filter((name) => re.test(name));

    // 你可以按自己的节点命名习惯改这里
    const hkNodes = matchNames(/香港|HK|Hong\s*Kong/i);
    const jpNodes = matchNames(/日本|JP|Japan|Tokyo|Osaka/i);
    const sgNodes = matchNames(/新加坡|狮城|SG|Singapore/i);
    const usNodes = matchNames(/美国|US|USA|United\s*States|America|Los\s*Angeles|San\s*Jose|Seattle/i);
    const twNodes = matchNames(/台湾|TW|Taiwan|Taipei/i);
    const auNodes = matchNames(/澳洲|澳大利亚|AU|Australia|Sydney|Melbourne|Perth/i);
    const myNodes = matchNames(/马来西亚|MY|Malaysia|Kuala\s*Lumpur/i);
    const arNodes = matchNames(/阿根廷|AR|Argentina|Buenos\s*Aires/i);
    const ukNodes = matchNames(/英国|UK|United\s*Kingdom|Britain|England|London|Manchester/i);

    const manualGroup = (name, proxies, type = "select", extra = {}) => ({
        name,
        type,
        proxies: uniq(proxies),
        ...extra,
    });

    const regionGroups = [
        manualGroup("香港节点", hkNodes.length ? hkNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("台湾节点", twNodes.length ? twNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("新加坡节点", sgNodes.length ? sgNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("日本节点", jpNodes.length ? jpNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("美国节点", usNodes.length ? usNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("英国节点", ukNodes.length ? ukNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("澳洲节点", auNodes.length ? auNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("马来西亚节点", myNodes.length ? myNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
        manualGroup("阿根廷节点", arNodes.length ? arNodes : ["节点选择"], "url-test", {
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        }),
    ];


    const customGroups = [
        {
            name: "自动选择",
            type: "url-test",
            proxies: uniq(allProxyNames),
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
        },
        {
            name: "节点选择",
            type: "select",
            proxies: uniq([
                "自动选择",
                "香港节点",
                "台湾节点",
                "新加坡节点",
                "日本节点",
                "美国节点",
                "英国节点",
                "澳洲节点",
                "马来西亚节点",
                "阿根廷节点",
                "DIRECT",
            ]),
        },

        ...regionGroups,

        {
            name: "国外媒体",
            type: "select",
            proxies: uniq([
                "节点选择",
                "自动选择",
                "香港节点",
                "台湾节点",
                "日本节点",
                "新加坡节点",
                "美国节点",
                "英国节点",
                "澳洲节点",
                "马来西亚节点",
                "阿根廷节点",
            ]),
        },
        {
            name: "AI平台",
            type: "select",
            proxies: uniq([
                "节点选择",
                "香港节点",
                "台湾节点",
                "日本节点",
                "新加坡节点",
                "美国节点",
                "英国节点",
                "澳洲节点",
                "马来西亚节点",
                "阿根廷节点",
            ]),
        },
        {
            name: "国外网站",
            type: "select",
            proxies: uniq([
                "节点选择",
                "自动选择",
                "香港节点",
                "台湾节点",
                "日本节点",
                "新加坡节点",
                "美国节点",
                "英国节点",
                "澳洲节点",
                "马来西亚节点",
                "阿根廷节点",
            ]),
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

    // 仅覆盖这三部分：rule-providers / proxy-groups / rules
    // 不动你的代理节点、DNS、端口等其他内容
    config["proxy-groups"] = customGroups;

    config["rule-providers"] = {
        advertising: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising.yaml",
            path: "./ruleset/Advertising.yaml",
            interval: 86400,
        },

        openai: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
            path: "./ruleset/OpenAI.yaml",
            interval: 86400,
        },
        claude: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
            path: "./ruleset/Claude.yaml",
            interval: 86400,
        },
        gemini: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml",
            path: "./ruleset/Gemini.yaml",
            interval: 86400,
        },
        copilot: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml",
            path: "./ruleset/Copilot.yaml",
            interval: 86400,
        },

        youtube: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml",
            path: "./ruleset/YouTube.yaml",
            interval: 86400,
        },
        netflix: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.yaml",
            path: "./ruleset/Netflix.yaml",
            interval: 86400,
        },
        globalmedia: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia.yaml",
            path: "./ruleset/GlobalMedia.yaml",
            interval: 86400,
        },

        github: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml",
            path: "./ruleset/GitHub.yaml",
            interval: 86400,
        },
        google: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
            path: "./ruleset/Google.yaml",
            interval: 86400,
        },
        telegram: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml",
            path: "./ruleset/Telegram.yaml",
            interval: 86400,
        },
        twitter: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.yaml",
            path: "./ruleset/Twitter.yaml",
            interval: 86400,
        },
        microsoft: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml",
            path: "./ruleset/Microsoft.yaml",
            interval: 86400,
        },

        china: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/China/China.yaml",
            path: "./ruleset/China.yaml",
            interval: 86400,
        },
        chinamedia: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMedia/ChinaMedia.yaml",
            path: "./ruleset/ChinaMedia.yaml",
            interval: 86400,
        },
        lan: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml",
            path: "./ruleset/Lan.yaml",
            interval: 86400,
        },
    };

    config.rules = [
        "RULE-SET,advertising,广告拦截",

        "RULE-SET,openai,AI平台",
        "RULE-SET,claude,AI平台",
        "RULE-SET,gemini,AI平台",
        "RULE-SET,copilot,AI平台",

        "RULE-SET,youtube,国外媒体",
        "RULE-SET,netflix,国外媒体",
        "RULE-SET,globalmedia,国外媒体",

        "RULE-SET,github,国外网站",
        "RULE-SET,google,国外网站",
        "RULE-SET,telegram,国外网站",
        "RULE-SET,twitter,国外网站",
        "RULE-SET,microsoft,国外网站",

        "RULE-SET,lan,国内网站",
        "RULE-SET,chinamedia,国内网站",
        "RULE-SET,china,国内网站",

        "MATCH,漏网之鱼",
    ];

    return config;
};
