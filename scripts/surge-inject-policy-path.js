#!/usr/bin/env node
/**
 * Replace __SURGE_POLICY_PATH__ in a Surge profile with a concrete policy-path value
 * (typically ./airport-surge-policies.txt after running airport-subscribe-to-surge-policy-list.js).
 *
 * Usage:
 *   node scripts/surge-inject-policy-path.js ./airport-surge-policies.txt < surge/surge-public.conf > surge/surge-private.local.conf
 *   node scripts/surge-inject-policy-path.js --absolute surge/airport-surge-policies.txt < surge/surge-public.conf > surge/surge-private.local.conf
 *
 * --absolute: expand a relative file path with path.resolve(process.cwd(), …) so Surge sees a full path (recommended when the .conf is not next to the .txt).
 */

"use strict";

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2).filter((a) => a !== "--absolute");
const useAbsolute = process.argv.includes("--absolute");
let replacement = args[0];
if (!replacement) {
  console.error(
    "Usage: node scripts/surge-inject-policy-path.js [--absolute] <policy-path-or-url>\n" +
      "  Example: node scripts/surge-inject-policy-path.js --absolute surge/airport-surge-policies.txt < surge/surge-public.conf > out.conf"
  );
  process.exit(1);
}
if (useAbsolute && !/^https?:\/\//i.test(replacement) && !path.isAbsolute(replacement)) {
  replacement = path.resolve(process.cwd(), replacement);
}

const input = fs.readFileSync(0, "utf8");
process.stdout.write(input.replace(/__SURGE_POLICY_PATH__/g, replacement));
