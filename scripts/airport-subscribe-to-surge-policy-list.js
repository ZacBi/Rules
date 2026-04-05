#!/usr/bin/env node
/**
 * Fetch an airport subscription URL (body is usually Base64), decode, parse anytls://
 * share links, and print Surge external policy-list lines for use with policy-path=.
 *
 * Usage:
 *   node scripts/airport-subscribe-to-surge-policy-list.js --url 'https://...'
 *   node scripts/airport-subscribe-to-surge-policy-list.js --url 'https://...' --insecure
 *   node scripts/airport-subscribe-to-surge-policy-list.js --url 'https://...' --user-agent-clash
 *   curl -fsS 'https://...' | node scripts/airport-subscribe-to-surge-policy-list.js
 *   node scripts/airport-subscribe-to-surge-policy-list.js --self-test
 *
 * Note: Some subscription URLs return Base64 anytls:// lines to a browser-like User-Agent,
 * but return a full Clash YAML profile when User-Agent looks like Clash (e.g. ClashMeta).
 * This script defaults to a browser UA so Base64 mode works; use --user-agent-clash only if
 * you add YAML→Surge parsing yourself.
 *
 * Requires: Node 18+ (global fetch). Surge Mac 6.4.3+ / iOS 5.17.0+ for AnyTLS.
 * @see https://manual.nssurge.com/policy/proxy.html
 */

"use strict";

const { stdin } = process;

/** Browser-like UA: many airports serve Base64 share-link bodies for this. */
const UA_BROWSER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
/** Clash-like UA: same URLs may return a full Clash profile instead — not handled here. */
const UA_CLASH = "ClashForWindows/0.20.39";

function usage() {
  console.error(`Usage:
  node scripts/airport-subscribe-to-surge-policy-list.js --url <subscription-url> [--insecure] [--user-agent-clash]
  node scripts/airport-subscribe-to-surge-policy-list.js --url <url> --user-agent 'CustomUA/1.0'
  curl -fsS <url> | node scripts/airport-subscribe-to-surge-policy-list.js
  node scripts/airport-subscribe-to-surge-policy-list.js --self-test`);
}

function looksLikeBase64Subscription(s) {
  const t = s.trim().replace(/\s+/g, "");
  if (t.length < 16) return false;
  if (!/^[A-Za-z0-9+/]+=*$/.test(t)) return false;
  return true;
}

function decodeSubscriptionBody(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (looksLikeBase64Subscription(trimmed)) {
    const b64 = trimmed.replace(/\s+/g, "");
    try {
      return Buffer.from(b64, "base64").toString("utf8");
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function sanitizePolicyName(name, index) {
  let n = name.replace(/\r$/, "").trim() || `node-${index + 1}`;
  n = n.replace(/,/g, "·").replace(/=/g, "-");
  if (n.length > 120) n = n.slice(0, 117) + "...";
  return n;
}

function anytlsUriToSurgeLine(line, index, usedNames) {
  const raw = line.trim();
  if (!raw.toLowerCase().startsWith("anytls://")) return null;
  let u;
  try {
    u = new URL(raw.replace(/^anytls:/i, "https:"));
  } catch {
    return null;
  }
  const password = decodeURIComponent(u.username || "");
  if (!password || !u.hostname) return null;
  const port = u.port || "443";
  const sni = u.searchParams.get("sni") || "";
  const insecure = u.searchParams.get("insecure") === "1";
  let frag = u.hash ? decodeURIComponent(u.hash.slice(1)) : "";
  let baseName = sanitizePolicyName(frag, index);
  let name = baseName;
  let n = 2;
  while (usedNames.has(name)) {
    name = `${baseName}-${n++}`;
  }
  usedNames.add(name);

  let lineOut = `${name} = anytls, ${u.hostname}, ${port}, password=${password}`;
  if (sni) lineOut += `, sni=${sni}`;
  if (insecure) lineOut += `, skip-cert-verify=true`;
  return lineOut;
}

function bodyToSurgePolicyLines(decodedText) {
  const usedNames = new Set();
  const lines = decodedText.split(/\r?\n/);
  const out = [];
  let i = 0;
  for (const line of lines) {
    const surge = anytlsUriToSurgeLine(line, i, usedNames);
    if (surge) {
      out.push(surge);
      i++;
    }
  }
  return out;
}

async function readStdin() {
  const chunks = [];
  for await (const c of stdin) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

function looksLikeClashProfileYaml(s) {
  return s.trimStart().startsWith("mixed-port:");
}

async function fetchSubscription(url, { insecureTls = false, userAgent = UA_BROWSER } = {}) {
  if (insecureTls) {
    const https = await import("node:https");
    return new Promise((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: "GET",
          headers: {
            "User-Agent": userAgent,
            Accept: "*/*",
          },
          rejectUnauthorized: false,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const body = Buffer.concat(chunks).toString("utf8");
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}`));
              return;
            }
            resolve(body);
          });
        }
      );
      req.on("error", reject);
      req.end();
    });
  }
  let res;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        Accept: "*/*",
      },
      redirect: "follow",
    });
  } catch (e) {
    const detail = e.cause ? `${e.message}: ${e.cause.message || e.cause}` : e.message;
    throw new Error(`fetch failed (${detail}). Try --insecure if TLS is intercepted or cert chain is unusual.`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.text();
}

function selfTest() {
  const fixture = [
    "anytls://11111111-1111-1111-1111-111111111111@example.com:443?sni=example.com&insecure=0#Test-A",
    "anytls://22222222-2222-2222-2222-222222222222@example.com:8443?sni=example.com&insecure=1#Test-B",
  ].join("\n");
  const b64 = Buffer.from(fixture, "utf8").toString("base64");
  const decoded = decodeSubscriptionBody(b64);
  const lines = bodyToSurgePolicyLines(decoded);
  const expect =
    lines.length === 2 &&
    lines[0].includes("password=11111111-1111-1111-1111-111111111111") &&
    lines[0].includes("sni=example.com") &&
    !lines[0].includes("skip-cert-verify=true") &&
    lines[1].includes("skip-cert-verify=true") &&
    lines[1].includes("8443");
  if (!expect) {
    console.error("Self-test failed:", lines);
    process.exit(1);
  }
  console.error("Self-test OK (2 AnyTLS policies parsed).");
  lines.forEach((l) => console.log(l));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    selfTest();
    return;
  }
  const urlIdx = args.indexOf("--url");
  const insecureTls = args.includes("--insecure");
  const uaClash = args.includes("--user-agent-clash");
  const uaIdx = args.indexOf("--user-agent");
  const userAgent =
    uaIdx !== -1 && args[uaIdx + 1]
      ? args[uaIdx + 1]
      : uaClash
        ? UA_CLASH
        : UA_BROWSER;
  let raw = "";
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    raw = await fetchSubscription(args[urlIdx + 1], { insecureTls, userAgent });
  } else if (!stdin.isTTY) {
    raw = await readStdin();
  } else {
    usage();
    process.exit(1);
  }
  const decoded = decodeSubscriptionBody(raw);
  const lines = bodyToSurgePolicyLines(decoded);
  if (lines.length === 0) {
    if (looksLikeClashProfileYaml(raw)) {
      console.error(
        "Response looks like a Clash/Mihomo profile (not Base64 share links). " +
          "This server switches format by User-Agent: retry without --user-agent-clash, " +
          "or use: curl -fsS 'URL' | node scripts/airport-subscribe-to-surge-policy-list.js"
      );
    } else {
      console.error(
        "No anytls:// lines found after decode. If the body is Base64, check network / TLS; if plain text, ensure lines start with anytls://"
      );
    }
    process.exit(2);
  }
  for (const l of lines) console.log(l);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
