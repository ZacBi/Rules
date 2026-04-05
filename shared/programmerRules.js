"use strict";

/**
 * Only rules that BM7 rule-sets do not cover as a unit. Package / learning traffic
 * uses Blackmatrix7 lists wired in shared/rulesets.js (Npmjs, Docker, Python, …).
 */

const localDevRules = [
  "DOMAIN,localhost,DIRECT",
  "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
  "IP-CIDR6,::1/128,DIRECT,no-resolve",
];

function registryAndLearningRules() {
  return [];
}

function inlineRulesBeforeRuleSets() {
  return [...localDevRules];
}

module.exports = {
  inlineRulesBeforeRuleSets,
  registryAndLearningRules,
};
