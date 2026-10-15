import type { Metadata } from "next";
import NewsDetailPage from "./NewsDetailPage";
import { fetchPublicCmsContent } from "@/lib/cmsContent";
import { findNewsBySlug, getNewsDetailHref, getRelatedNews } from "@/lib/news";
import { absoluteSiteUrl } from "@/lib/siteMetadata";

type Props = PageProps<"/tin-tuc/[slug]">;

export const dynamic = "force-dynamic";

async function getNewsBySlug(slug: string) {
  const cmsContent = await fetchPublicCmsContent();
  const mergedNews = cmsContent.news;
  const item = findNewsBySlug(mergedNews, slug);
  return { item, news: mergedNews };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await getNewsBySlug(slug);
  if (!item) {
    return {
      title: "Tin tức",
      description: "Tin tức và cập nhật mới nhất từ Hữu Thành Construction.",
    };
  }

  return {
    title: item.title,
    description: item.excerpt,
    alternates: {
      canonical: absoluteSiteUrl(getNewsDetailHref(item)),
    },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url: absoluteSiteUrl(getNewsDetailHref(item)),
      images: [item.thumbnail],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { item, news } = await getNewsBySlug(slug);
  if (!item) return <NewsDetailPage slug={slug} />;

  return <NewsDetailPage item={item} relatedNews={getRelatedNews(news, item)} />;
}
