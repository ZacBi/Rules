"use strict";

const fs = require("fs");
const path = require("path");

const { main } = require("../dist/mihomo/override");

function writeSmokeConfig(outputPath) {
  if (!outputPath) {
    throw new Error("Missing output path");
  }

  const config = main({
    proxies: [
      {
        name: "US-01",
        type: "socks5",
        server: "127.0.0.1",
        port: 9,
      },
    ],
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

if (require.main === module) {
  writeSmokeConfig(process.argv[2]);
}

module.exports = {
  writeSmokeConfig,
};
