import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { cmsApiUrl } from "@/lib/siteApi";
import { slugify } from "@/lib/utils";

const CMS_STORAGE_KEY = "huu-thanh-cms-content-v1";
const legacyContentFallbackEnabled = process.env.NODE_ENV !== "production";
const PUBLIC_REVALIDATE_SECONDS = 60;
const PUBLIC_FETCH_TIMEOUT_MS = 3500;

export type CmsContent = {
  news: NewsItem[];
  projects: Project[];
  jobs: Job[];
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
  if (!legacyContentFallbackEnabled || !isBrowser()) return emptyContent;

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
    return normalizeCmsContent(await response.json());
  } catch {
    return loadCmsContent();
  }
}

export async function fetchPublicCmsContent(): Promise<CmsContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PUBLIC_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(cmsApiUrl("/api/cms"), {
      cache: "force-cache",
      next: {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["cms-content"],
      },
      signal: controller.signal,
    });
    if (!response.ok) return loadCmsContent();
    return normalizeCmsContent(await response.json());
  } catch {
    return loadCmsContent();
  } finally {
    clearTimeout(timeout);
  }
}

export function hasCmsContent(content?: CmsContent) {
  return Boolean(content && (content.news.length || content.projects.length || content.jobs.length));
}

function normalizeCmsContent(data: unknown): CmsContent {
  const parsed = (data ?? {}) as Partial<CmsContent>;

  return {
    news: Array.isArray(parsed.news) ? parsed.news : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
  };
}

export function mergeById<T extends { id: string; slug?: string; name?: string; title?: string }>(base: T[], custom: T[]): T[] {
  if (!legacyContentFallbackEnabled) return custom;
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
