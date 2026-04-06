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
 *   node scripts/airport-subscribe-to-surge-policy-list.js --url '...' --keep-noise
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
  node scripts/airport-subscribe-to-surge-policy-list.js --url <subscription-url> [--insecure] [--retries N] [--user-agent-clash]
  node scripts/airport-subscribe-to-surge-policy-list.js --url <url> --user-agent 'CustomUA/1.0'
  curl -fsS <url> | node scripts/airport-subscribe-to-surge-policy-list.js
  node scripts/airport-subscribe-to-surge-policy-list.js --self-test
  (optional) --keep-noise  — keep subscription info lines (traffic/reset/expire); default skips them for Surge compatibility`);
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

/**
 * Airports often prepend anytls:// links whose #fragment is account status (traffic, reset, expiry).
 * Those names contain full-width punctuation and spaces; Surge external policy lists may reject them.
 */
function isSubscriptionInfoFrag(frag) {
  const s = frag.trim();
  if (!s) return false;
  if (/剩余流量|距离下次重置|套餐到期|流量[:：]|重置[:：]|到期[:：]/.test(s)) return true;
  if (/[\d.]+\s*GB\b/i.test(s) && /流量|GB/i.test(s)) return true;
  if (/\d{4}-\d{2}-\d{2}/.test(s) && /到期|expire/i.test(s)) return true;
  return false;
}

function sanitizePolicyName(name, index) {
  let n = name.replace(/\r$/, "").trim() || `node-${index + 1}`;
  n = n
    .replace(/\uFF1A/g, "-")
    .replace(/\uFF0C/g, "·")
    .replace(/\u3002/g, ".")
    .replace(/\s+/g, "_");
  n = n.replace(/,/g, "·").replace(/=/g, "-");
  if (n.length > 120) n = n.slice(0, 117) + "...";
  return n;
}

function anytlsUriToSurgeLine(line, index, usedNames, options = {}) {
  const { keepNoise = false } = options;
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
  if (!keepNoise && isSubscriptionInfoFrag(frag)) return null;
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

function bodyToSurgePolicyLines(decodedText, options = {}) {
  const usedNames = new Set();
  const lines = decodedText.split(/\r?\n/);
  const out = [];
  let i = 0;
  for (const line of lines) {
    const surge = anytlsUriToSurgeLine(line, i, usedNames, options);
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

const FETCH_TIMEOUT_MS = 45_000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetryableFetchError(err) {
  const code = err && (err.code || err.cause?.code);
  const msg = `${err && err.message} ${err && err.cause && err.cause.message}`.toLowerCase();
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "UND_ERR_SOCKET" ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("socket hang up") ||
    msg.includes("network error") ||
    msg.includes("timeout")
  );
}

async function fetchSubscriptionOnce(url, { insecureTls = false, userAgent = UA_BROWSER } = {}) {
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
      req.setTimeout(FETCH_TIMEOUT_MS, () => {
        req.destroy(new Error(`timeout after ${FETCH_TIMEOUT_MS}ms`));
      });
      req.on("error", reject);
      req.end();
    });
  }
  /** Undici's default connect timeout is 10s; AbortSignal.timeout does not raise it. */
  let dispatcher;
  try {
    const { Agent } = await import("node:undici");
    dispatcher = new Agent({
      connectTimeout: FETCH_TIMEOUT_MS,
      headersTimeout: FETCH_TIMEOUT_MS,
      bodyTimeout: FETCH_TIMEOUT_MS,
    });
  } catch {
    dispatcher = undefined;
  }
  let res;
  try {
    const init = {
      headers: {
        "User-Agent": userAgent,
        Accept: "*/*",
      },
      redirect: "follow",
    };
    if (dispatcher) init.dispatcher = dispatcher;
    if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
      init.signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    }
    res = await fetch(url, init);
  } catch (e) {
    const detail = e.cause ? `${e.message}: ${e.cause.message || e.cause}` : e.message;
    const err = new Error(`fetch failed (${detail})`);
    err.cause = e;
    throw err;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.text();
}

async function fetchSubscription(url, { insecureTls = false, userAgent = UA_BROWSER, retries = 3 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchSubscriptionOnce(url, { insecureTls, userAgent });
    } catch (e) {
      lastErr = e;
      const retryable = isRetryableFetchError(e);
      if (!retryable || attempt === retries) break;
      await sleep(300 * attempt * attempt);
    }
  }
  const tail =
    "Try: --insecure (TLS inspection / odd chains), or pipe: curl -fsSL --connect-timeout 30 'URL' | node scripts/airport-subscribe-to-surge-policy-list.js";
  throw new Error(`${lastErr && lastErr.message}. ${tail}`);
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

  const withNoise = [
    "anytls://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee@example.com:443?sni=example.com#剩余流量：80.09 GB",
    "anytls://11111111-1111-1111-1111-111111111111@example.com:443?sni=example.com#Test-A",
  ].join("\n");
  const noiseDecoded = decodeSubscriptionBody(Buffer.from(withNoise, "utf8").toString("base64"));
  const noiseSkipped = bodyToSurgePolicyLines(noiseDecoded);
  const noiseKept = bodyToSurgePolicyLines(noiseDecoded, { keepNoise: true });
  if (noiseSkipped.length !== 1 || !noiseSkipped[0].includes("Test-A")) {
    console.error("Self-test failed (expected info-frag line skipped):", noiseSkipped);
    process.exit(1);
  }
  if (noiseKept.length !== 2) {
    console.error("Self-test failed (--keep-noise):", noiseKept);
    process.exit(1);
  }

  console.error("Self-test OK (2 policies + noise-skip checks).");
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
  const keepNoise = args.includes("--keep-noise");
  const uaClash = args.includes("--user-agent-clash");
  const uaIdx = args.indexOf("--user-agent");
  const retriesIdx = args.indexOf("--retries");
  const retries =
    retriesIdx !== -1 && args[retriesIdx + 1] && /^\d+$/.test(args[retriesIdx + 1])
      ? Math.min(10, Math.max(1, parseInt(args[retriesIdx + 1], 10)))
      : 3;
  const userAgent =
    uaIdx !== -1 && args[uaIdx + 1]
      ? args[uaIdx + 1]
      : uaClash
        ? UA_CLASH
        : UA_BROWSER;
  let raw = "";
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    raw = await fetchSubscription(args[urlIdx + 1], { insecureTls, userAgent, retries });
  } else if (!stdin.isTTY) {
    raw = await readStdin();
  } else {
    usage();
    process.exit(1);
  }
  const decoded = decodeSubscriptionBody(raw);
  const lines = bodyToSurgePolicyLines(decoded, { keepNoise });
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
