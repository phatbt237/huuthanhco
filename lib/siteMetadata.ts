const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://huuthanhco.vercel.app");

export const SITE_URL = configuredSiteUrl.replace(/\/$/, "");

export function absoluteSiteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
