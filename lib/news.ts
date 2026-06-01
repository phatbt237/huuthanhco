import type { NewsItem } from "@/data/news";
import { news } from "@/data/news";
import { slugify } from "@/lib/utils";

export function getNewsSlug(item: Pick<NewsItem, "id" | "title" | "slug">) {
  return item.slug || `${slugify(item.title)}-n${item.id}`;
}

export function getNewsDetailHref(item: Pick<NewsItem, "id" | "title" | "slug">) {
  return `/tin-tuc/${getNewsSlug(item)}`;
}

export function findStaticNewsBySlug(slug: string) {
  return findNewsBySlug(news, slug);
}

export function getRelatedStaticNews(item: NewsItem, limit = 4) {
  return getRelatedNews(news, item, limit);
}

export function findNewsBySlug(items: NewsItem[], slug: string) {
  return items.find((item) => getNewsSlug(item) === slug || item.id === slug);
}

export function getRelatedNews(items: NewsItem[], item: NewsItem, limit = 4) {
  const sameCategory = items.filter((newsItem) => newsItem.id !== item.id && newsItem.category === item.category);
  const others = items.filter((newsItem) => newsItem.id !== item.id && newsItem.category !== item.category);
  return [...sameCategory, ...others].slice(0, limit);
}
