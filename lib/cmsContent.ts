import { useEffect, useState } from "react";
import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";

const CMS_STORAGE_KEY = "huu-thanh-cms-content-v1";
const CMS_API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/$/, "") ?? "";

export type CmsContent = {
  news: NewsItem[];
  projects: Project[];
  jobs: Job[];
};

type RequestOptions = {
  token?: string;
};

const emptyContent: CmsContent = {
  news: [],
  projects: [],
  jobs: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function cmsApiUrl(path: string) {
  const normalizedPath =
    CMS_API_BASE_URL.endsWith("/api") && path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;
  return `${CMS_API_BASE_URL}${normalizedPath}`;
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

export function useCmsContent() {
  const [content, setContent] = useState<CmsContent>(emptyContent);

  useEffect(() => {
    const refresh = () => {
      setContent(loadCmsContent());
      void fetchCmsContent().then(setContent);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("huu-thanh-cms-content-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("huu-thanh-cms-content-updated", refresh);
    };
  }, []);

  return content;
}

export function mergeById<T extends { id: string }>(base: T[], custom: T[]): T[] {
  const customIds = new Set(custom.map((item) => item.id));
  return [...custom, ...base.filter((item) => !customIds.has(item.id))];
}
