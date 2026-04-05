"use strict";

const { regions } = require("./regions");

const regionGroupNames = regions.map((region) => region.groupName);

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
    proxies: ["自动选择", ...regionGroupNames, "DIRECT"],
  },
];

const businessGroups = [
  {
    name: "国外媒体",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames],
  },
  {
    name: "AI平台",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames],
  },
  {
    name: "即时通讯",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames],
  },
  {
    name: "微软服务",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames, "DIRECT"],
  },
  {
    name: "苹果服务",
    type: "select",
    proxies: ["DIRECT", "节点选择", "自动选择", ...regionGroupNames],
  },
  {
    name: "游戏平台",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames],
  },
  {
    name: "国外网站",
    type: "select",
    proxies: ["节点选择", "自动选择", ...regionGroupNames],
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

module.exports = {
  strategyGroups,
  businessGroups,
};

