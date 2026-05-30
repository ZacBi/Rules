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
  const required = ["general", "dns", "policy", "filter_remote", "filter_local"];
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

  if (/server_check_url|geo_location_checker|resource_parser_url|network_check_url/.test(text)) {
    errors.push(`${file}: contains general URL key that should stay user-local`);
  }
  if (/\[server_remote\]/.test(text)) {
    errors.push(`${file}: contains [server_remote]`);
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

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    if (/blackmatrix7\/ios_rule_script/.test(line) && !line.includes("opt-parser=false")) {
      errors.push(`${file}:${lineNumber}: blackmatrix7 remote missing opt-parser=false`);
    }
    if (/^static\s=|^url-latency-benchmark\s=/.test(line)) {
      errors.push(`${file}:${lineNumber}: policy assignment has space before "="`);
    }
    if (/^(DOMAIN|DOMAIN-SUFFIX|IP-CIDR|IP-CIDR6|FINAL),/.test(line)) {
      errors.push(`${file}:${lineNumber}: filter type should be lower-case`);
    }
  });

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

function validatePublicSafety() {
  const files = [
    "dist/quantumultx/rules.conf",
    "dist/surge/module.sgmodule",
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
    surge: validateSurge,
    stash: validateStash,
    mihomo: validateMihomo,
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
  validatePublicSafety,
};
