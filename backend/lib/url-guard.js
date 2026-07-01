import { lookup } from "dns/promises";
import net from "net";

/**
 * SSRF protection helpers.
 *
 * The backend fetches URLs supplied in request bodies (a PDF URL, a LinkedIn
 * profile URL). Without validation an attacker could point those at internal
 * services or cloud metadata endpoints (e.g. 169.254.169.254). These helpers
 * reject non-http(s) schemes and any host that resolves to a private/reserved
 * IP range.
 */

const PRIVATE_IPV4_RANGES = [
  [ip("10.0.0.0"), ip("10.255.255.255")],
  [ip("172.16.0.0"), ip("172.31.255.255")],
  [ip("192.168.0.0"), ip("192.168.255.255")],
  [ip("127.0.0.0"), ip("127.255.255.255")], // loopback
  [ip("169.254.0.0"), ip("169.254.255.255")], // link-local / cloud metadata
  [ip("0.0.0.0"), ip("0.255.255.255")], // "this" network
  [ip("100.64.0.0"), ip("100.127.255.255")], // CGNAT
];

function ip(addr) {
  return addr.split(".").reduce((acc, oct) => acc * 256 + Number(oct), 0);
}

function isPrivateIPv4(addr) {
  const value = ip(addr);
  return PRIVATE_IPV4_RANGES.some(([lo, hi]) => value >= lo && value <= hi);
}

function isPrivateIPv6(addr) {
  const a = addr.toLowerCase();
  if (a === "::1" || a === "::") return true; // loopback / unspecified
  if (a.startsWith("fc") || a.startsWith("fd")) return true; // unique local fc00::/7
  if (a.startsWith("fe8") || a.startsWith("fe9") || a.startsWith("fea") || a.startsWith("feb")) {
    return true; // link-local fe80::/10
  }
  // IPv4-mapped IPv6 e.g. ::ffff:169.254.169.254
  const mapped = a.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

function isPrivateAddress(addr) {
  const family = net.isIP(addr);
  if (family === 4) return isPrivateIPv4(addr);
  if (family === 6) return isPrivateIPv6(addr);
  return true; // unknown → treat as unsafe
}

/**
 * Validate a user-supplied URL for server-side fetching.
 *
 * @param {unknown} rawUrl
 * @param {{ allowedHosts?: string[] }} [opts] optional host allowlist (suffix match)
 * @returns {Promise<URL>} the parsed, validated URL
 * @throws {Error} with a `.statusCode` (400/403) on rejection
 */
export async function assertSafeUrl(rawUrl, opts = {}) {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") {
    throw badRequest("A valid URL string is required.");
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw badRequest("Malformed URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw badRequest("Only http and https URLs are allowed.");
  }

  if (opts.allowedHosts && opts.allowedHosts.length > 0) {
    const host = parsed.hostname.toLowerCase();
    const ok = opts.allowedHosts.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
    if (!ok) throw forbidden(`Host not allowed: ${parsed.hostname}`);
  }

  // Resolve the hostname and reject if any resolved address is private/reserved.
  const hostname = parsed.hostname;
  if (net.isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw forbidden("Refusing to fetch a private/reserved address.");
  } else {
    let records;
    try {
      records = await lookup(hostname, { all: true });
    } catch {
      throw badRequest("Could not resolve host.");
    }
    if (records.some((r) => isPrivateAddress(r.address))) {
      throw forbidden("Refusing to fetch a private/reserved address.");
    }
  }

  return parsed;
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function forbidden(message) {
  const err = new Error(message);
  err.statusCode = 403;
  return err;
}
