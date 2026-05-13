import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://huuthanh.vn";

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/du-an`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/thiet-bi`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/tuyen-dung`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), priority: 0.7 },
  ];
}
