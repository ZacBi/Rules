"use strict";

const defaultHealthCheck = {
  url: "https://www.gstatic.com/generate_204",
  interval: 300,
  tolerance: 50,
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

module.exports = {
  defaultHealthCheck,
  regions,
};

