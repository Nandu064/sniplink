export const APP_NAME = "Sniplink";
export const APP_DESCRIPTION =
  "Shorten URLs, track clicks, and analyze traffic with Sniplink. Free URL shortener with detailed analytics, custom aliases, and real-time click tracking.";
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "signin",
  "signup",
  "forgot-password",
  "reset-password",
  "error",
  "about",
  "features",
  "pricing",
  "settings",
  "admin",
  "blog",
  "help",
  "support",
  "terms",
  "privacy",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
  "_next",
  "opengraph-image",
  "twitter-image",
  "icon",
  "apple-icon",
]);

export const SLUG_LENGTH = 7;
export const MAX_SLUG_LENGTH = 50;
export const MIN_SLUG_LENGTH = 3;
export const BCRYPT_SALT_ROUNDS = 12;
export const LINKS_PER_PAGE = 10;

export const CHART_COLORS = [
  "#4F46E5",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#64748B",
] as const;
