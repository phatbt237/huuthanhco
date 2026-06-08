import { MetadataRoute } from "next";
import { fetchPublicCmsContent } from "@/lib/cmsContent";
import { getNewsDetailHref } from "@/lib/news";
import { getProjectDetailHref } from "@/lib/projects";
import { SITE_URL } from "@/lib/siteMetadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, priority: 1 },
    { url: `${SITE_URL}/gioi-thieu`, lastModified, priority: 0.8 },
    { url: `${SITE_URL}/du-an`, lastModified, priority: 0.9 },
    { url: `${SITE_URL}/thiet-bi`, lastModified, priority: 0.7 },
    { url: `${SITE_URL}/tin-tuc`, lastModified, priority: 0.8 },
    { url: `${SITE_URL}/tuyen-dung`, lastModified, priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, lastModified, priority: 0.7 },
  ];

  try {
    const content = await fetchPublicCmsContent();
    const projectPages = content.projects.map((project) => ({
      url: `${SITE_URL}${getProjectDetailHref(project)}`,
      lastModified,
      priority: 0.7,
    }));
    const newsPages = content.news.map((item) => ({
      url: `${SITE_URL}${getNewsDetailHref(item)}`,
      lastModified: item.date ? new Date(item.date) : lastModified,
      priority: 0.6,
    }));

    return [...staticPages, ...projectPages, ...newsPages];
  } catch {
    return staticPages;
  }
}
