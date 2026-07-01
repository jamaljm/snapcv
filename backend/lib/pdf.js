import axios from "axios";
import pdf from "pdf-parse";

const DEFAULT_MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const DEFAULT_TIMEOUT_MS = 20_000;

/**
 * Extract plain text from a PDF buffer.
 * @param {Buffer|ArrayBuffer} buffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(buffer) {
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Download a PDF into memory with a hard size cap and timeout.
 *
 * Returns a Buffer rather than writing to disk, which avoids temp-file leaks
 * and bounds memory use. Call assertSafeUrl() on the URL first (SSRF guard).
 *
 * @param {string} url
 * @param {{ maxBytes?: number, timeoutMs?: number, headers?: Record<string,string> }} [opts]
 * @returns {Promise<Buffer>}
 */
export async function fetchPdfBuffer(url, opts = {}) {
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: timeoutMs,
    maxContentLength: maxBytes,
    maxBodyLength: maxBytes,
    headers: opts.headers,
  });

  const buffer = Buffer.from(response.data);
  if (buffer.length > maxBytes) {
    const err = new Error("Downloaded file exceeds the maximum allowed size.");
    err.statusCode = 413;
    throw err;
  }
  return buffer;
}
