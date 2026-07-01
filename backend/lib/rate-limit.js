/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Both endpoints are unauthenticated and drive paid OpenAI calls, so an
 * unthrottled caller could run up the bill or hammer LinkedIn. This caps
 * requests per IP per window. Good enough for a single Azure App Service
 * instance; swap for a Redis-backed limiter if the app is ever scaled out.
 */
export function rateLimit({ windowMs = 60_000, max = 20 } = {}) {
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = clientKey(req);

    let entry = hits.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many requests. Please slow down." });
    }

    // Opportunistic cleanup so the map doesn't grow unbounded.
    if (hits.size > 10_000) {
      for (const [k, v] of hits) {
        if (now >= v.resetAt) hits.delete(k);
      }
    }

    next();
  };
}

/**
 * Derive a stable per-client key.
 *
 * Azure App Service puts the client IP *with an ephemeral port* in
 * X-Forwarded-For (e.g. "1.2.3.4:29470"), which changes every request, so
 * req.ip is useless as a rate-limit key. It also sets X-Client-IP to the bare
 * client IP — prefer that. Fall back to req.ip with any :port stripped.
 */
function clientKey(req) {
  const xci = req.headers["x-client-ip"];
  if (xci) return String(xci).split(",")[0].trim();

  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const ipv4WithPort = String(ip).match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (ipv4WithPort) return ipv4WithPort[1];
  return String(ip).replace(/^::ffff:/, "");
}
