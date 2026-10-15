const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.huuthanhco.com";

export const SITE_URL = configuredSiteUrl.replace(/\/$/, "");

export function absoluteSiteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
