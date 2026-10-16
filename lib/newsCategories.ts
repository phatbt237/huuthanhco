export const newsCategories = [
  { value: "Tin công ty", valueEn: "Company News" },
  { value: "Dự án", valueEn: "Projects" },
  { value: "Blog", valueEn: "Blog" },
] as const;

export const DEFAULT_NEWS_CATEGORY = newsCategories[0];

export function isNewsCategory(value: string) {
  return newsCategories.some((category) => category.value === value);
}

export function getNewsCategoryEnglish(value: string) {
  return newsCategories.find((category) => category.value === value)?.valueEn ?? value;
}
