import { UAParser } from "ua-parser-js";
import crypto from "crypto";

export function parseUserAgent(uaString: string) {
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  return {
    browser: result.browser.name || null,
    os: result.os.name || null,
    device: categorizeDevice(result.device.type),
  };
}

function categorizeDevice(type?: string): string {
  if (!type) return "desktop";
  if (type === "mobile") return "mobile";
  if (type === "tablet") return "tablet";
  return "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET || "default-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}

export function extractRefererDomain(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).hostname;
  } catch {
    return null;
  }
}
