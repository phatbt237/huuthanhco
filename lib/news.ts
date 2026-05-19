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
  return news.find((item) => getNewsSlug(item) === slug || item.id === slug);
}

export function getRelatedStaticNews(item: NewsItem, limit = 4) {
  const sameCategory = news.filter((newsItem) => newsItem.id !== item.id && newsItem.category === item.category);
  const others = news.filter((newsItem) => newsItem.id !== item.id && newsItem.category !== item.category);
  return [...sameCategory, ...others].slice(0, limit);
}
