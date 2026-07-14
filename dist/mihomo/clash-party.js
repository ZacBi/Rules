const MODULE_INDEX = {
  "schemaVersion": 1,
  "model": "unified-strategy-pack",
  "defaultHealthCheck": {
    "url": "https://www.gstatic.com/generate_204",
    "interval": 600,
    "tolerance": 100,
    "timeout": 3
  },
  "strategyGroups": [
    {
      "key": "all",
      "name": "全部节点",
      "type": "select",
      "mode": "all-proxies"
    },
    {
      "key": "auto",
      "name": "自动选择",
      "type": "url-test",
      "mode": "all-proxies"
    },
    {
      "key": "select",
      "name": "节点选择",
      "type": "select",
      "proxies": [
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
        "DIRECT"
      ]
    }
  ],
  "serviceCheckGroups": [],
  "businessGroups": [
    {
      "name": "国外媒体",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "AI平台",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "Claude",
      "type": "select",
      "proxies": [
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
        "阿根廷节点"
      ]
    },
    {
      "name": "即时通讯",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "微软服务",
      "type": "select",
      "proxies": [
        "DIRECT",
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "苹果服务",
      "type": "select",
      "proxies": [
        "DIRECT",
        "节点选择",
        "自动选择",
        "全部节点"
      ]
    },
    {
      "name": "游戏平台",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "金融网站",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "国外网站",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "全部节点",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点"
      ]
    },
    {
      "name": "国内网站",
      "type": "select",
      "proxies": [
        "DIRECT",
        "节点选择"
      ]
    },
    {
      "name": "字节跳动",
      "type": "select",
      "proxies": [
        "DIRECT",
        "节点选择"
      ]
    },
    {
      "name": "广告拦截",
      "type": "select",
      "proxies": [
        "REJECT",
        "DIRECT"
      ]
    },
    {
      "name": "漏网之鱼",
      "type": "select",
      "proxies": [
        "节点选择",
        "自动选择",
        "DIRECT"
      ]
    }
  ],
  "stashEnhancementGroups": [
    {
      "name": "香港优先",
      "type": "fallback",
      "hidden": true,
      "match": "香港|HK|Hong\\s*Kong"
    },
    {
      "name": "媒体负载均衡",
      "type": "load-balance",
      "hidden": true,
      "strategy": "consistent-hashing",
      "match": "香港|HK|Hong\\s*Kong|台湾|TW|Taiwan|Taipei|日本|JP|Japan|Tokyo|Osaka|新加坡|狮城|SG|Singapore|美国|US|USA|United\\s*States|America|Los\\s*Angeles|San\\s*Jose|Seattle"
    }
  ],
  "stashPolicyChoices": {
    "国外媒体": {
      "after": "自动选择",
      "choices": [
        "媒体负载均衡"
      ]
    }
  },
  "quantumultxEnhancementGroups": [
    {
      "name": "香港优先",
      "type": "available",
      "match": "香港|HK|Hong\\s*Kong"
    },
    {
      "name": "媒体轮询",
      "type": "round-robin",
      "match": "香港|HK|Hong\\s*Kong|台湾|TW|Taiwan|Taipei|日本|JP|Japan|Tokyo|Osaka|新加坡|狮城|SG|Singapore|美国|US|USA|United\\s*States|America|Los\\s*Angeles|San\\s*Jose|Seattle"
    }
  ],
  "quantumultxPolicyChoices": {
    "节点选择": [
      "香港优先"
    ],
    "国外媒体": [
      "媒体轮询"
    ]
  },
  "regions": [
    {
      "key": "hong_kong",
      "name": "香港",
      "groupName": "香港节点",
      "match": "香港|HK|Hong\\s*Kong"
    },
    {
      "key": "taiwan",
      "name": "台湾",
      "groupName": "台湾节点",
      "match": "台湾|TW|Taiwan|Taipei"
    },
    {
      "key": "japan",
      "name": "日本",
      "groupName": "日本节点",
      "match": "日本|JP|Japan|Tokyo|Osaka"
    },
    {
      "key": "singapore",
      "name": "新加坡",
      "groupName": "新加坡节点",
      "match": "新加坡|狮城|SG|Singapore"
    },
    {
      "key": "united_states",
      "name": "美国",
      "groupName": "美国节点",
      "match": "美国|US|USA|United\\s*States|America|Los\\s*Angeles|San\\s*Jose|Seattle"
    },
    {
      "key": "united_kingdom",
      "name": "英国",
      "groupName": "英国节点",
      "match": "英国|UK|United\\s*Kingdom|Britain|England|London|Manchester"
    },
    {
      "key": "australia",
      "name": "澳洲",
      "groupName": "澳洲节点",
      "match": "澳洲|澳大利亚|AU|Australia|Sydney|Melbourne|Perth"
    },
    {
      "key": "malaysia",
      "name": "马来西亚",
      "groupName": "马来西亚节点",
      "match": "马来西亚|MY|Malaysia|Kuala\\s*Lumpur"
    },
    {
      "key": "argentina",
      "name": "阿根廷",
      "groupName": "阿根廷节点",
      "match": "阿根廷|AR|Argentina|Buenos\\s*Aires"
    }
  ],
  "ruleSets": [
    {
      "id": "advertising",
      "sourceName": "Advertising",
      "group": "广告拦截",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Advertising/Advertising.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Advertising.list"
      },
      "paths": {
        "mihomo": "./ruleset/Advertising.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "lan",
      "sourceName": "Lan",
      "group": "国内网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Lan/Lan.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Lan/Lan.list"
      },
      "paths": {
        "mihomo": "./ruleset/Lan.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "bilibili",
      "sourceName": "BiliBili",
      "group": "国内网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBili/BiliBili.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/BiliBili/BiliBili.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/BiliBili/BiliBili.list"
      },
      "paths": {
        "mihomo": "./ruleset/BiliBili.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "china",
      "sourceName": "ChinaMax",
      "group": "国内网站",
      "behavior": "domain",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMax/ChinaMax_Domain.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ChinaMax/ChinaMax.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMax/ChinaMax.list"
      },
      "paths": {
        "mihomo": "./ruleset/ChinaMax_Domain.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "bytedance",
      "sourceName": "ByteDance",
      "group": "字节跳动",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ByteDance/ByteDance.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ByteDance/ByteDance.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ByteDance/ByteDance.list"
      },
      "paths": {
        "mihomo": "./ruleset/ByteDance.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "chinamedia",
      "sourceName": "ChinaMedia",
      "group": "国内网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMedia/ChinaMedia.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ChinaMedia/ChinaMedia.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMedia/ChinaMedia.list"
      },
      "paths": {
        "mihomo": "./ruleset/ChinaMedia.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "openai",
      "sourceName": "OpenAI",
      "group": "AI平台",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/OpenAI/OpenAI.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list"
      },
      "paths": {
        "mihomo": "./ruleset/OpenAI.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "claude",
      "sourceName": "Claude",
      "group": "Claude",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Claude/Claude.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Claude/Claude.list"
      },
      "paths": {
        "mihomo": "./ruleset/Claude.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "anthropic",
      "sourceName": "Anthropic",
      "group": "Claude",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Anthropic/Anthropic.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Anthropic/Anthropic.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Anthropic/Anthropic.list"
      },
      "paths": {
        "mihomo": "./ruleset/Anthropic.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "gemini",
      "sourceName": "Gemini",
      "group": "AI平台",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Gemini/Gemini.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Gemini/Gemini.list"
      },
      "paths": {
        "mihomo": "./ruleset/Gemini.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "copilot",
      "sourceName": "Copilot",
      "group": "AI平台",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Copilot/Copilot.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Copilot/Copilot.list"
      },
      "paths": {
        "mihomo": "./ruleset/Copilot.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "youtube",
      "sourceName": "YouTube",
      "group": "国外媒体",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/YouTube/YouTube.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/YouTube/YouTube.list"
      },
      "paths": {
        "mihomo": "./ruleset/YouTube.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "netflix",
      "sourceName": "Netflix",
      "group": "国外媒体",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Netflix/Netflix.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Netflix/Netflix.list"
      },
      "paths": {
        "mihomo": "./ruleset/Netflix.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "spotify",
      "sourceName": "Spotify",
      "group": "国外媒体",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Spotify/Spotify.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Spotify/Spotify.list"
      },
      "paths": {
        "mihomo": "./ruleset/Spotify.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "tiktok",
      "sourceName": "TikTok",
      "group": "国外媒体",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/TikTok/TikTok.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/TikTok/TikTok.list"
      },
      "paths": {
        "mihomo": "./ruleset/TikTok.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "globalmedia",
      "sourceName": "GlobalMedia",
      "group": "国外媒体",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/GlobalMedia/GlobalMedia.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GlobalMedia/GlobalMedia.list"
      },
      "paths": {
        "mihomo": "./ruleset/GlobalMedia.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "github",
      "sourceName": "GitHub",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/GitHub/GitHub.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitHub/GitHub.list"
      },
      "paths": {
        "mihomo": "./ruleset/GitHub.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "npmjs",
      "sourceName": "Npmjs",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Npmjs/Npmjs.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Npmjs/Npmjs.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Npmjs/Npmjs.list"
      },
      "paths": {
        "mihomo": "./ruleset/Npmjs.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "docker",
      "sourceName": "Docker",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Docker/Docker.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Docker/Docker.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Docker/Docker.list"
      },
      "paths": {
        "mihomo": "./ruleset/Docker.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "python",
      "sourceName": "Python",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Python/Python.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Python/Python.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Python/Python.list"
      },
      "paths": {
        "mihomo": "./ruleset/Python.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "gitlab",
      "sourceName": "GitLab",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitLab/GitLab.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/GitLab/GitLab.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitLab/GitLab.list"
      },
      "paths": {
        "mihomo": "./ruleset/GitLab.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "scholar",
      "sourceName": "Scholar",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Scholar/Scholar.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Scholar/Scholar.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Scholar/Scholar.list"
      },
      "paths": {
        "mihomo": "./ruleset/Scholar.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "wikipedia",
      "sourceName": "Wikipedia",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Wikipedia/Wikipedia.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Wikipedia/Wikipedia.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Wikipedia/Wikipedia.list"
      },
      "paths": {
        "mihomo": "./ruleset/Wikipedia.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "stackexchange",
      "sourceName": "Stackexchange",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Stackexchange/Stackexchange.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Stackexchange/Stackexchange.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Stackexchange/Stackexchange.list"
      },
      "paths": {
        "mihomo": "./ruleset/Stackexchange.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "google",
      "sourceName": "Google",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Google/Google.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list"
      },
      "paths": {
        "mihomo": "./ruleset/Google.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "telegram",
      "sourceName": "Telegram",
      "group": "即时通讯",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Telegram/Telegram.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Telegram/Telegram.list"
      },
      "paths": {
        "mihomo": "./ruleset/Telegram.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "discord",
      "sourceName": "Discord",
      "group": "即时通讯",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Discord/Discord.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Discord/Discord.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Discord/Discord.list"
      },
      "paths": {
        "mihomo": "./ruleset/Discord.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "twitter",
      "sourceName": "Twitter",
      "group": "国外网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Twitter/Twitter.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Twitter/Twitter.list"
      },
      "paths": {
        "mihomo": "./ruleset/Twitter.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "microsoft",
      "sourceName": "Microsoft",
      "group": "微软服务",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Microsoft/Microsoft.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list"
      },
      "paths": {
        "mihomo": "./ruleset/Microsoft.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "apple",
      "sourceName": "Apple",
      "group": "苹果服务",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Apple/Apple.list"
      },
      "paths": {
        "mihomo": "./ruleset/Apple.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "steam",
      "sourceName": "Steam",
      "group": "游戏平台",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Steam/Steam.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Steam/Steam.list"
      },
      "paths": {
        "mihomo": "./ruleset/Steam.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "epic",
      "sourceName": "Epic",
      "group": "游戏平台",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Epic/Epic.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Epic/Epic.list"
      },
      "paths": {
        "mihomo": "./ruleset/Epic.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "longbridge",
      "sourceName": "Longbridge",
      "group": "金融网站",
      "behavior": "classical",
      "origin": "project",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/longbridge.yaml",
        "surge": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/longbridge.list",
        "quantumultx": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/longbridge.list"
      },
      "paths": {
        "mihomo": "./ruleset/Longbridge.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "ibkr",
      "sourceName": "IBKR",
      "group": "金融网站",
      "behavior": "classical",
      "origin": "project",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/ibkr.yaml",
        "surge": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/ibkr.list",
        "quantumultx": "https://raw.githubusercontent.com/ZacBi/Rules/master/rules/ibkr.list"
      },
      "paths": {
        "mihomo": "./ruleset/IBKR.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    },
    {
      "id": "tigerfintech",
      "sourceName": "TigerFintech",
      "group": "金融网站",
      "behavior": "classical",
      "origin": "blackmatrix7",
      "sourceUrl": null,
      "urls": {
        "mihomo": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TigerFintech/TigerFintech.yaml",
        "surge": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/TigerFintech/TigerFintech.list",
        "quantumultx": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/TigerFintech/TigerFintech.list"
      },
      "paths": {
        "mihomo": "./ruleset/TigerFintech.yaml"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ]
    }
  ],
  "routingRules": [
    {
      "rule": "DOMAIN-SUFFIX,openai.com",
      "group": "AI平台",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,chatgpt.com",
      "group": "AI平台",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,anthropic.com",
      "group": "Claude",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,claude.ai",
      "group": "Claude",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,googlevideo.com",
      "group": "国外媒体",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,youtube.com",
      "group": "国外媒体",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,ytimg.com",
      "group": "国外媒体",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,telegram.org",
      "group": "即时通讯",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,t.me",
      "group": "即时通讯",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,discord.com",
      "group": "即时通讯",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,discordapp.com",
      "group": "即时通讯",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,whop.com",
      "group": "即时通讯",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,google.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,googleapis.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,gstatic.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,googleusercontent.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,ggpht.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,github.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,githubusercontent.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,githubassets.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,npmjs.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,docker.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,pythonhosted.org",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,gitlab.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,x.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN-SUFFIX,twitter.com",
      "group": "国外网站",
      "origin": "bootstrap",
      "sourceUrl": null
    },
    {
      "rule": "DOMAIN,ios.chat.openai.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN,android.chat.openai.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,auth.openai.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,challenges.cloudflare.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,workos.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,statsigapi.net",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,featuregates.org",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,appattest.apple.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    },
    {
      "rule": "DOMAIN-SUFFIX,devicecheck.apple.com",
      "group": "AI平台",
      "origin": "openai-docs",
      "sourceUrl": "https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps"
    }
  ],
  "runtimeModules": [
    {
      "id": "runtime.ai.assistant",
      "kind": "script",
      "domain": "ai",
      "title": "assistant-panel",
      "emitByDefault": false,
      "sourceMode": "unresolved",
      "sourceUrl": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "support": {
        "supportLevel": {
          "stash": "partial",
          "surge": "partial",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Metadata only until a maintained upstream script URL is selected.",
          "surge": "Metadata only until a maintained upstream script URL is selected.",
          "mihomo": "No equivalent cross-client script runtime is emitted by override.js."
        }
      },
      "dependencies": [
        "scenario.ai"
      ],
      "conflicts": [],
      "render": {},
      "ui": {
        "title": "AI assistant panel",
        "surface": "script",
        "defaultState": "opt-in",
        "riskLevel": "medium",
        "requiresMitm": false,
        "defaultEnabled": false,
        "iosPerformanceCost": "medium",
        "performanceNote": "Requires HTTP script runtime; keep disabled unless the panel is needed."
      }
    },
    {
      "id": "runtime.media.unlock",
      "kind": "rewrite",
      "domain": "media",
      "title": "reject-tracking",
      "emitByDefault": false,
      "sourceMode": "local",
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "support": {
        "supportLevel": {
          "stash": "partial",
          "surge": "partial",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Metadata only. The previous broad redirect dropped useful URL state and is intentionally not emitted.",
          "surge": "Metadata only. The previous broad redirect dropped useful URL state and is intentionally not emitted.",
          "mihomo": "Mihomo and Clash Party do not consume Stash or Surge HTTP rewrite sections."
        }
      },
      "dependencies": [
        "scenario.media"
      ],
      "conflicts": [],
      "render": {},
      "ui": {
        "title": "Tracking parameter cleanup",
        "surface": "rewrite",
        "defaultState": "disabled",
        "riskLevel": "high",
        "requiresMitm": false,
        "defaultEnabled": false,
        "iosPerformanceCost": "low",
        "performanceNote": "Disabled until a path-preserving cleaner is available; broad redirects can break pages."
      }
    },
    {
      "id": "runtime.app.upgrade-check",
      "kind": "rewrite",
      "domain": "utility",
      "title": "app-upgrade-check-block",
      "emitByDefault": true,
      "sourceMode": "remote-derived",
      "sourceUrl": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rewrite/Stash/Upgrade/Upgrade.stoverride",
      "supportedClients": [
        "stash"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "unsupported",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Derived from blackmatrix7 ios_rule_script Stash Upgrade rewrite.",
          "surge": "Use the upstream Surge module directly if needed.",
          "mihomo": "No equivalent runtime rewrite is emitted by override.js."
        }
      },
      "dependencies": [
        "base.core"
      ],
      "conflicts": [],
      "render": {
        "stashRewrite": [
          "^https?:\\/\\/api\\.ishansong\\.com\\/app\\/check\\/v\\d+\\/check - reject",
          "^https?:\\/\\/api\\.m\\.jd\\.com\\/openUpgrade - reject",
          "^https?:\\/\\/apimobile\\.meituan\\.com\\/appupdate\\/mach\\/checkUpdate? - reject",
          "^https?:\\/\\/apprn\\.pizzahut\\.com\\.cn\\/updateCheck\\? - reject",
          "^https?:\\/\\/capis(-?\\w*)?\\.didapinche\\.com\\/publish\\/api\\/upgrade - reject",
          "^https?:\\/\\/ccsp-egmas\\.sf-express\\.com\\/cx-app-base\\/base\\/app\\/appVersion\\/detectionUpgrade - reject",
          "^https?:\\/\\/fmapp\\.chinafamilymart\\.com\\.cn\\/api\\/app\\/biz\\/base\\/appversion\\/latest - reject",
          "^https?:\\/\\/m\\.client\\.10010\\.com\\/mobileService\\/(activity|customer)\\/(accountListData|get_client_adv|get_startadv) - reject",
          "^https?:\\/\\/sso\\.lxjapp\\.com\\/\\/chims\\/servlet\\/csGetLatestSoftwareVersionServlet - reject",
          "^https?:\\/\\/www\\.meituan\\.com\\/api\\/v\\d\\/appstatus\\? - reject"
        ],
        "hostnames": [
          "api.ishansong.com",
          "api.m.jd.com",
          "apimobile.meituan.com",
          "apprn.pizzahut.com.cn",
          "capis*.didapinche.com",
          "ccsp-egmas.sf-express.com",
          "fmapp.chinafamilymart.com.cn",
          "m.client.10010.com",
          "sso.lxjapp.com",
          "www.meituan.com"
        ]
      },
      "ui": {
        "title": "Block common app upgrade checks",
        "surface": "rewrite",
        "defaultState": "enabled",
        "riskLevel": "medium",
        "requiresMitm": true,
        "defaultEnabled": true,
        "iosPerformanceCost": "low",
        "performanceNote": "Small Stash rewrite subset derived from upstream; HTTPS matches require MITM hosts."
      }
    },
    {
      "id": "runtime.google.no-country-redirect",
      "kind": "rewrite",
      "domain": "google",
      "title": "google-no-country-redirect",
      "emitByDefault": true,
      "sourceMode": "local",
      "sourceUrl": "https://stash.wiki/http-engine/rewrite",
      "supportedClients": [
        "stash"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "unsupported",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Keeps Google Hong Kong entry URLs on google.com without changing DNS or routing policy.",
          "surge": "Use a client-side URL rewrite module if needed.",
          "mihomo": "No equivalent runtime rewrite is emitted by override.js."
        }
      },
      "dependencies": [
        "scenario.web"
      ],
      "conflicts": [],
      "render": {
        "stashRewrite": [
          "^https?:\\/\\/www\\.google\\.com\\.hk\\/?$ https://www.google.com/ncr 302",
          "^https?:\\/\\/www\\.google\\.com\\.hk\\/(.*) https://www.google.com/$1 302"
        ],
        "hostnames": [
          "www.google.com.hk"
        ]
      },
      "ui": {
        "title": "Google no country redirect",
        "surface": "rewrite",
        "defaultState": "enabled",
        "riskLevel": "medium",
        "requiresMitm": true,
        "defaultEnabled": true,
        "iosPerformanceCost": "low",
        "performanceNote": "Narrow redirect for Google Hong Kong URLs; HTTPS matching requires MITM for www.google.com.hk."
      }
    },
    {
      "id": "runtime.apple.testflight-download",
      "kind": "script",
      "domain": "apple",
      "title": "testflight-download-fix",
      "emitByDefault": true,
      "sourceMode": "remote",
      "sourceUrl": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/external/Stash/TestFlight/TestFlight.stoverride",
      "supportedClients": [
        "stash"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "unsupported",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Uses the script provider URL from blackmatrix7 ios_rule_script external Stash TestFlight.",
          "surge": "Use the upstream Surge module directly if needed.",
          "mihomo": "No equivalent runtime script is emitted by override.js."
        }
      },
      "dependencies": [
        "scenario.vendor"
      ],
      "conflicts": [],
      "render": {
        "stashScript": {
          "name": "testflight-download-fix",
          "type": "request",
          "match": "^https?:\\/\\/testflight\\.apple\\.com\\/v\\d\\/accounts\\/.+?\\/install$",
          "requireBody": true,
          "timeout": 30,
          "argument": "",
          "binaryMode": false,
          "maxSize": 1048576,
          "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/javascript/043922e05c79445b6da818d0864c1b7d.js"
        },
        "hostnames": [
          "testflight.apple.com"
        ]
      },
      "ui": {
        "title": "TestFlight download fix",
        "surface": "script",
        "defaultState": "enabled",
        "riskLevel": "medium",
        "requiresMitm": true,
        "defaultEnabled": true,
        "iosPerformanceCost": "medium",
        "performanceNote": "Requires request body and MITM only for TestFlight install requests."
      }
    },
    {
      "id": "runtime.mitm.openai",
      "kind": "mitm",
      "domain": "ai",
      "title": "openai-tls-hosts",
      "emitByDefault": false,
      "sourceMode": "local",
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "full",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Rendered as MITM hostnames.",
          "surge": "Rendered as MITM hostname append list.",
          "mihomo": "MITM is not emitted from the generic Mihomo override."
        }
      },
      "dependencies": [
        "base.core"
      ],
      "conflicts": [],
      "render": {
        "hostnames": [
          "*.openai.com"
        ]
      },
      "ui": {
        "title": "OpenAI TLS inspection hosts",
        "surface": "mitm",
        "defaultState": "opt-in",
        "riskLevel": "high",
        "requiresMitm": true,
        "defaultEnabled": false,
        "iosPerformanceCost": "high",
        "performanceNote": "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows."
      }
    },
    {
      "id": "runtime.mitm.anthropic",
      "kind": "mitm",
      "domain": "ai",
      "title": "anthropic-tls-hosts",
      "emitByDefault": false,
      "sourceMode": "local",
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "full",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Rendered as MITM hostnames.",
          "surge": "Rendered as MITM hostname append list.",
          "mihomo": "MITM is not emitted from the generic Mihomo override."
        }
      },
      "dependencies": [
        "base.core"
      ],
      "conflicts": [],
      "render": {
        "hostnames": [
          "*.anthropic.com"
        ]
      },
      "ui": {
        "title": "Anthropic TLS inspection hosts",
        "surface": "mitm",
        "defaultState": "opt-in",
        "riskLevel": "high",
        "requiresMitm": true,
        "defaultEnabled": false,
        "iosPerformanceCost": "high",
        "performanceNote": "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows."
      }
    },
    {
      "id": "runtime.mitm.githubusercontent",
      "kind": "mitm",
      "domain": "developer",
      "title": "githubusercontent-tls-hosts",
      "emitByDefault": false,
      "sourceMode": "local",
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "support": {
        "supportLevel": {
          "stash": "full",
          "surge": "full",
          "mihomo": "unsupported"
        },
        "notes": {
          "stash": "Rendered as MITM hostnames.",
          "surge": "Rendered as MITM hostname append list.",
          "mihomo": "MITM is not emitted from the generic Mihomo override."
        }
      },
      "dependencies": [
        "base.core"
      ],
      "conflicts": [],
      "render": {
        "hostnames": [
          "*.githubusercontent.com"
        ]
      },
      "ui": {
        "title": "GitHub raw asset TLS inspection hosts",
        "surface": "mitm",
        "defaultState": "opt-in",
        "riskLevel": "high",
        "requiresMitm": true,
        "defaultEnabled": false,
        "iosPerformanceCost": "high",
        "performanceNote": "MITM changes TLS handling; only enable for explicitly trusted troubleshooting flows."
      }
    }
  ],
  "runtimeSupportMatrix": {
    "stash": {
      "rewrite": "full",
      "script": "full",
      "mitm": "full"
    },
    "surge": {
      "rewrite": "full",
      "script": "full",
      "mitm": "full"
    },
    "mihomo": {
      "rewrite": "unsupported",
      "script": "unsupported",
      "mitm": "unsupported"
    },
    "quantumultx": {
      "rewrite": "metadata-only",
      "script": "metadata-only",
      "mitm": "metadata-only"
    }
  },
  "clashInlineRules": [
    "AND,((NETWORK,UDP),(DST-PORT,443)),REJECT"
  ],
  "inlineRules": [
    "DOMAIN,localhost,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve"
  ],
  "modules": [
    {
      "id": "base.core",
      "layer": "base",
      "domain": "core",
      "title": "Core strategy scaffold",
      "groups": [
        "全部节点",
        "自动选择",
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
        "漏网之鱼"
      ],
      "ruleSets": [
        "advertising",
        "lan",
        "china"
      ],
      "dependsOn": [],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": true,
        "script": true,
        "mitm": true
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.ai",
      "layer": "scenario",
      "domain": "ai",
      "title": "AI platforms",
      "groups": [
        "AI平台",
        "Claude"
      ],
      "ruleSets": [
        "openai",
        "claude",
        "anthropic",
        "gemini",
        "copilot"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.media",
      "layer": "scenario",
      "domain": "media",
      "title": "Streaming media",
      "groups": [
        "国外媒体"
      ],
      "ruleSets": [
        "youtube",
        "netflix",
        "spotify",
        "tiktok",
        "globalmedia"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.dev",
      "layer": "scenario",
      "domain": "dev",
      "title": "Developer tools",
      "groups": [
        "国外网站"
      ],
      "ruleSets": [
        "github",
        "npmjs",
        "docker",
        "python",
        "gitlab"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.research",
      "layer": "scenario",
      "domain": "research",
      "title": "Learning and research",
      "groups": [
        "国外网站"
      ],
      "ruleSets": [
        "scholar",
        "wikipedia",
        "stackexchange"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.chat",
      "layer": "scenario",
      "domain": "chat",
      "title": "Messaging",
      "groups": [
        "即时通讯"
      ],
      "ruleSets": [
        "telegram",
        "discord"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.vendor",
      "layer": "scenario",
      "domain": "vendor",
      "title": "Vendor services",
      "groups": [
        "微软服务",
        "苹果服务"
      ],
      "ruleSets": [
        "microsoft",
        "apple"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.games",
      "layer": "scenario",
      "domain": "games",
      "title": "Gaming platforms",
      "groups": [
        "游戏平台"
      ],
      "ruleSets": [
        "steam",
        "epic"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.finance",
      "layer": "scenario",
      "domain": "finance",
      "title": "Financial platforms",
      "groups": [
        "金融网站"
      ],
      "ruleSets": [
        "longbridge",
        "ibkr",
        "tigerfintech"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.web",
      "layer": "scenario",
      "domain": "web",
      "title": "Global web",
      "groups": [
        "国外网站"
      ],
      "ruleSets": [
        "google",
        "twitter",
        "github",
        "npmjs",
        "docker",
        "python",
        "gitlab",
        "scholar",
        "wikipedia",
        "stackexchange"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.domestic",
      "layer": "scenario",
      "domain": "domestic",
      "title": "Domestic routing",
      "groups": [
        "国内网站"
      ],
      "ruleSets": [
        "bilibili",
        "chinamedia"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.bytedance",
      "layer": "scenario",
      "domain": "bytedance",
      "title": "ByteDance employee direct routing",
      "groups": [
        "字节跳动"
      ],
      "ruleSets": [
        "bytedance"
      ],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.ads",
      "layer": "scenario",
      "domain": "ads",
      "title": "Ad blocking",
      "groups": [
        "广告拦截"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "scenario.fallback",
      "layer": "scenario",
      "domain": "fallback",
      "title": "Catch-all routing",
      "groups": [
        "漏网之鱼"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core"
      ],
      "output": null,
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": []
    },
    {
      "id": "client.stash.entry",
      "layer": "client",
      "domain": "stash",
      "title": "Stash entry override",
      "groups": [
        "全部节点",
        "自动选择",
        "节点选择",
        "香港优先",
        "媒体负载均衡",
        "国外媒体",
        "AI平台",
        "Claude",
        "即时通讯",
        "微软服务",
        "苹果服务",
        "游戏平台",
        "金融网站",
        "国外网站",
        "国内网站",
        "字节跳动",
        "广告拦截",
        "漏网之鱼",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点",
        "英国节点",
        "澳洲节点",
        "马来西亚节点",
        "阿根廷节点"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "output": {
        "path": "dist/stash/stash.stoverride",
        "format": "stash-override"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": true,
        "script": true,
        "mitm": true
      },
      "conflicts": [],
      "notes": [
        "Designed for clients that already resolve subscription parsing upstream."
      ]
    },
    {
      "id": "client.mihomo.entry",
      "layer": "client",
      "domain": "mihomo",
      "title": "Mihomo entry override",
      "groups": [
        "全部节点",
        "自动选择",
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
        "国外媒体",
        "AI平台",
        "Claude",
        "即时通讯",
        "微软服务",
        "苹果服务",
        "游戏平台",
        "金融网站",
        "国外网站",
        "国内网站",
        "字节跳动",
        "广告拦截",
        "漏网之鱼"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "output": {
        "path": "dist/mihomo/override.js",
        "format": "mihomo-override-js"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": [
        "Rendered as an override script with explicit runtime capability downgrades."
      ]
    },
    {
      "id": "client.clash-party.entry",
      "layer": "client",
      "domain": "clash-party",
      "title": "Clash Party remote override",
      "groups": [
        "全部节点",
        "自动选择",
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
        "国外媒体",
        "AI平台",
        "Claude",
        "即时通讯",
        "微软服务",
        "苹果服务",
        "游戏平台",
        "金融网站",
        "国外网站",
        "国内网站",
        "字节跳动",
        "广告拦截",
        "漏网之鱼"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "output": {
        "path": "dist/mihomo/clash-party.js",
        "format": "clash-party-override-js"
      },
      "supportedClients": [
        "clash-party"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": [
        "Rendered without CommonJS exports so Clash Party can import it as a remote JavaScript override."
      ]
    },
    {
      "id": "client.surge.entry",
      "layer": "client",
      "domain": "surge",
      "title": "Surge entry module",
      "groups": [
        "全部节点",
        "自动选择",
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
        "国外媒体",
        "AI平台",
        "Claude",
        "即时通讯",
        "微软服务",
        "苹果服务",
        "游戏平台",
        "金融网站",
        "国外网站",
        "国内网站",
        "字节跳动",
        "广告拦截",
        "漏网之鱼"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "output": {
        "path": "dist/surge/module.sgmodule",
        "format": "surge-module"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": true,
        "script": true,
        "mitm": true
      },
      "conflicts": [],
      "notes": [
        "Rendered as a reusable Surge module fragment rather than a full profile."
      ]
    },
    {
      "id": "client.quantumultx.entry",
      "layer": "client",
      "domain": "quantumultx",
      "title": "Quantumult X lightweight lazy profile",
      "groups": [
        "全部节点",
        "自动选择",
        "节点选择",
        "香港优先",
        "媒体轮询",
        "香港节点",
        "台湾节点",
        "日本节点",
        "新加坡节点",
        "美国节点",
        "英国节点",
        "澳洲节点",
        "马来西亚节点",
        "阿根廷节点",
        "国外媒体",
        "AI平台",
        "Claude",
        "即时通讯",
        "微软服务",
        "苹果服务",
        "游戏平台",
        "金融网站",
        "国外网站",
        "国内网站",
        "字节跳动",
        "广告拦截",
        "漏网之鱼"
      ],
      "ruleSets": [],
      "dependsOn": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "output": {
        "path": "dist/quantumultx/rules.conf",
        "format": "quantumultx-profile"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": true,
        "rewrite": false,
        "script": false,
        "mitm": false
      },
      "conflicts": [],
      "notes": [
        "Rendered as a public-safe lightweight lazy profile for policies and filters; server subscriptions are imported separately."
      ]
    },
    {
      "id": "client.quantumultx.sub-store",
      "layer": "client",
      "domain": "quantumultx",
      "title": "Quantumult X Sub-Store optional addon",
      "groups": [],
      "ruleSets": [],
      "dependsOn": [],
      "output": {
        "path": "dist/quantumultx/sub-store.conf",
        "format": "quantumultx-profile-addon"
      },
      "supportedClients": [
        "stash",
        "mihomo",
        "surge",
        "quantumultx"
      ],
      "capabilities": {
        "routing": false,
        "rewrite": true,
        "script": true,
        "mitm": false
      },
      "conflicts": [],
      "notes": [
        "Optional addon that imports Sub-Store official Quantumult X rewrite and task resources; not enabled by the default lightweight profile."
      ]
    }
  ],
  "entrypoints": {
    "stash": {
      "moduleId": "client.stash.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/stash/stash.stoverride",
      "format": "stash-override"
    },
    "mihomo": {
      "moduleId": "client.mihomo.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/mihomo/override.js",
      "format": "mihomo-override-js"
    },
    "clashParty": {
      "moduleId": "client.clash-party.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/mihomo/clash-party.js",
      "format": "clash-party-override-js"
    },
    "surge": {
      "moduleId": "client.surge.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/surge/module.sgmodule",
      "format": "surge-module"
    },
    "surgeProxyGroups": {
      "moduleId": "client.surge.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/surge/proxy-groups.dconf",
      "format": "surge-detached-proxy-groups"
    },
    "surgeProxyGroupsCompact": {
      "moduleId": "client.surge.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/surge/proxy-groups.compact.dconf",
      "format": "surge-detached-proxy-groups"
    },
    "surgeRules": {
      "moduleId": "client.surge.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/surge/rules.dconf",
      "format": "surge-detached-rules"
    },
    "quantumultx": {
      "moduleId": "client.quantumultx.entry",
      "modules": [
        "base.core",
        "scenario.ai",
        "scenario.media",
        "scenario.dev",
        "scenario.research",
        "scenario.chat",
        "scenario.vendor",
        "scenario.games",
        "scenario.finance",
        "scenario.web",
        "scenario.domestic",
        "scenario.bytedance",
        "scenario.ads",
        "scenario.fallback"
      ],
      "outputPath": "dist/quantumultx/rules.conf",
      "format": "quantumultx-profile"
    },
    "quantumultxSubStore": {
      "moduleId": "client.quantumultx.sub-store",
      "modules": [
        "client.quantumultx.sub-store"
      ],
      "outputPath": "dist/quantumultx/sub-store.conf",
      "format": "quantumultx-profile-addon"
    }
  }
};

function uniq(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function main(config = {}) {
  config.proxies ??= [];
  config["proxy-groups"] ??= [];
  config["rule-providers"] ??= {};
  config.rules ??= [];

  const defaultUrl = MODULE_INDEX.defaultHealthCheck.url;
  const defaultInterval = MODULE_INDEX.defaultHealthCheck.interval;
  const defaultTolerance = MODULE_INDEX.defaultHealthCheck.tolerance;

  function buildProxyNames(config) {
    return uniq((config.proxies || []).map((proxy) => proxy && proxy.name));
  }

  function buildRegionGroups(proxyNames) {
    return MODULE_INDEX.regions.map((region) => {
      const matched = proxyNames.filter((name) => new RegExp(region.match, "i").test(name));
      return {
        name: region.groupName,
        type: "url-test",
        hidden: true,
        proxies: matched.length ? uniq(matched) : ["节点选择"],
        url: defaultUrl,
        interval: defaultInterval,
        tolerance: defaultTolerance,
      };
    });
  }

  function buildStrategyGroups(proxyNames) {
    return MODULE_INDEX.strategyGroups.map((group) => {
      if (group.mode === "all-proxies") {
        const generated = {
          name: group.name,
          type: group.type,
          proxies: proxyNames.length ? uniq(proxyNames) : ["DIRECT"],
        };
        if (group.type !== "select") {
          generated.url = defaultUrl;
          generated.interval = defaultInterval;
          generated.tolerance = defaultTolerance;
        }
        return generated;
      }

      return {
        name: group.name,
        type: group.type,
        proxies: uniq(group.proxies),
      };
    });
  }

  function buildServiceCheckGroups() {
    return MODULE_INDEX.serviceCheckGroups.map((group) => ({
      name: group.name,
      type: group.type,
      proxies: uniq(group.proxies),
      url: group.url,
      interval: group.interval,
      tolerance: group.tolerance,
    }));
  }

  function buildBusinessGroups() {
    return MODULE_INDEX.businessGroups.map((group) => ({
      name: group.name,
      type: group.type,
      proxies: uniq(group.proxies),
    }));
  }

  function buildRuleProviders() {
    return MODULE_INDEX.ruleSets.reduce((providers, ruleSet) => {
      providers[ruleSet.id] = {
        type: "http",
        behavior: ruleSet.behavior,
        url: ruleSet.urls.mihomo,
        path: ruleSet.paths.mihomo,
        interval: 86400,
      };
      return providers;
    }, {});
  }

  function buildRules() {
    return [
      ...MODULE_INDEX.clashInlineRules,
      ...MODULE_INDEX.inlineRules,
      ...MODULE_INDEX.routingRules.map((route) => `${route.rule},${route.group}`),
      ...MODULE_INDEX.ruleSets.map((ruleSet) => `RULE-SET,${ruleSet.id},${ruleSet.group}`),
      "MATCH,漏网之鱼",
    ];
  }

  const proxyNames = buildProxyNames(config);
  config["proxy-groups"] = [
    ...buildStrategyGroups(proxyNames),
    ...buildServiceCheckGroups(),
    ...buildRegionGroups(proxyNames),
    ...buildBusinessGroups(),
  ];
  config["rule-providers"] = buildRuleProviders();
  config.rules = buildRules();
  config["x-runtime-support"] = MODULE_INDEX.runtimeSupportMatrix;
  return config;
}
