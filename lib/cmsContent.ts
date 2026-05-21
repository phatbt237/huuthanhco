import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { cmsApiUrl } from "@/lib/siteApi";
import { slugify } from "@/lib/utils";

const CMS_STORAGE_KEY = "huu-thanh-cms-content-v1";

export type CmsContent = {
  news: NewsItem[];
  projects: Project[];
  jobs: Job[];
};

type RequestOptions = {
  token?: string;
};

export const emptyContent: CmsContent = {
  news: [],
  projects: [],
  jobs: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadCmsContent(): CmsContent {
  if (!isBrowser()) return emptyContent;

  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return emptyContent;
    const parsed = JSON.parse(raw) as Partial<CmsContent>;

    return {
      news: Array.isArray(parsed.news) ? parsed.news : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
    };
  } catch {
    return emptyContent;
  }
}

export async function fetchCmsContent(): Promise<CmsContent> {
  try {
    const response = await fetch(cmsApiUrl("/api/cms"), { cache: "no-store" });
    if (!response.ok) return loadCmsContent();
    const parsed = (await response.json()) as Partial<CmsContent>;

    return {
      news: Array.isArray(parsed.news) ? parsed.news : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
    };
  } catch {
    return loadCmsContent();
  }
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function saveCmsContent(content: CmsContent, options: RequestOptions = {}) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
  const response = await fetch(cmsApiUrl("/api/cms"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(options.token) },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Không lưu được dữ liệu CMS vào database.");
  }

  window.dispatchEvent(new Event("huu-thanh-cms-content-updated"));
}

export async function clearCmsContent(options: RequestOptions = {}) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CMS_STORAGE_KEY);
  const response = await fetch(cmsApiUrl("/api/cms"), {
    method: "DELETE",
    headers: authHeaders(options.token),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Không xóa được dữ liệu CMS trong database.");
  }
  window.dispatchEvent(new Event("huu-thanh-cms-content-updated"));
}

export function mergeById<T extends { id: string; slug?: string; name?: string; title?: string }>(base: T[], custom: T[]): T[] {
  const customKeys = new Set(custom.flatMap(getContentKeys));
  return [...custom, ...base.filter((item) => !getContentKeys(item).some((key) => customKeys.has(key)))];
}

function getContentKeys<T extends { id: string; slug?: string; name?: string; title?: string }>(item: T) {
  const keys = [`id:${item.id}`];
  if (item.slug) keys.push(`slug:${item.slug}`);
  const title = item.name || item.title;
  if (title) keys.push(`title:${slugify(title)}`);
  return keys;
}
