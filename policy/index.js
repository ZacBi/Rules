"use strict";

const { buildModuleIndex } = require("./catalog");
const {
  renderClashPartyEntry,
  renderMihomoEntry,
  renderQuantumultxEntry,
  renderQuantumultxSubStoreAddon,
  renderStashEntry,
  renderSurgeEntry,
  renderSurgeProxyGroups,
  renderSurgeRules,
} = require("./renderers");

function buildArtifacts() {
  const moduleIndex = buildModuleIndex();

  return {
    moduleIndex,
    files: [
      {
        path: "dist/modules/index.json",
        content: JSON.stringify(moduleIndex, null, 2),
      },
      {
        path: moduleIndex.entrypoints.stash.outputPath,
        content: renderStashEntry(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.mihomo.outputPath,
        content: renderMihomoEntry(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.clashParty.outputPath,
        content: renderClashPartyEntry(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.surge.outputPath,
        content: renderSurgeEntry(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.surgeProxyGroups.outputPath,
        content: renderSurgeProxyGroups(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.surgeProxyGroupsCompact.outputPath,
        content: renderSurgeProxyGroups(moduleIndex, { compact: true }),
      },
      {
        path: moduleIndex.entrypoints.surgeRules.outputPath,
        content: renderSurgeRules(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.quantumultx.outputPath,
        content: renderQuantumultxEntry(moduleIndex),
      },
      {
        path: moduleIndex.entrypoints.quantumultxSubStore.outputPath,
        content: renderQuantumultxSubStoreAddon(moduleIndex),
      },
    ],
  };
}

module.exports = {
  buildArtifacts,
};
