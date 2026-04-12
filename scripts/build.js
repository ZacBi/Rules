"use strict";

const fs = require("fs");
const path = require("path");

const { buildArtifacts } = require("../policy");

const rootDir = path.resolve(__dirname, "..");

function ensureDir(relativeDir) {
  fs.mkdirSync(path.join(rootDir, relativeDir), { recursive: true });
}

function writeFile(relativePath, content) {
  const fullPath = path.join(rootDir, relativePath);
  ensureDir(path.dirname(relativePath));
  fs.writeFileSync(fullPath, `${content.trimEnd()}\n`, "utf8");
}

function main() {
  const artifacts = buildArtifacts();

  for (const file of artifacts.files) {
    writeFile(file.path, file.content);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
};
