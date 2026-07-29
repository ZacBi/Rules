"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const vm = require("node:vm");

const { buildArtifacts } = require("../policy");

function builtArtifact(path) {
  const artifact = buildArtifacts().files.find((file) => file.path === path);
  assert.ok(artifact, `missing generated artifact: ${path}`);
  return artifact.content;
}

function runMihomoOverride(proxies) {
  const sandbox = {
    input: { proxies },
    module: { exports: {} },
    result: null,
  };
  vm.runInNewContext(
    `${builtArtifact("dist/mihomo/override.js")}\nresult = main(input);`,
    sandbox
  );
  return sandbox.result;
}

function containsProxyGroupCycle(groups) {
  const groupNames = new Set(groups.map((group) => group.name));
  const references = new Map(
    groups.map((group) => [
      group.name,
      (group.proxies || []).filter((proxy) => groupNames.has(proxy)),
    ])
  );
  const visited = new Set();
  const visiting = new Set();

  function visit(name) {
    if (visiting.has(name)) {
      return true;
    }
    if (visited.has(name)) {
      return false;
    }

    visiting.add(name);
    for (const referencedGroup of references.get(name) || []) {
      if (visit(referencedGroup)) {
        return true;
      }
    }
    visiting.delete(name);
    visited.add(name);
    return false;
  }

  return groups.some((group) => visit(group.name));
}

test("Mihomo override has no proxy-group cycle when some regions have no nodes", () => {
  const config = runMihomoOverride([{ name: "香港-1" }]);

  assert.equal(containsProxyGroupCycle(config["proxy-groups"]), false);
});

test("Quantumult X local filters use native host rule types", () => {
  const profile = builtArtifact("dist/quantumultx/rules.conf");
  const localFilters = profile.match(
    /^\[filter_local\]\n([\s\S]*?)\n\[rewrite_local\]$/m
  );

  assert.ok(localFilters, "missing Quantumult X filter_local section");
  assert.match(localFilters[1], /^host,localhost,direct$/m);
  assert.match(localFilters[1], /^host-suffix,openai\.com,AI平台$/m);
  assert.doesNotMatch(localFilters[1], /^(?:domain|domain-suffix),/m);
});

test("Surge detached files and module each keep one section header", () => {
  const proxyGroups = builtArtifact("dist/surge/proxy-groups.dconf");
  const rules = builtArtifact("dist/surge/rules.dconf");
  const module = builtArtifact("dist/surge/module.sgmodule");

  assert.equal((proxyGroups.match(/^\[Proxy Group\]$/gm) || []).length, 1);
  assert.equal((rules.match(/^\[Rule\]$/gm) || []).length, 1);
  assert.equal((module.match(/^\[Proxy Group\]$/gm) || []).length, 1);
  assert.equal((module.match(/^\[Rule\]$/gm) || []).length, 1);
});
