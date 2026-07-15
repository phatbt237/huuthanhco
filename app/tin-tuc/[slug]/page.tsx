import type { Metadata } from "next";
import NewsDetailPage from "./NewsDetailPage";
import { fetchPublicCmsContent, mergeById } from "@/lib/cmsContent";
import { news as staticNews } from "@/data/news";
import { findNewsBySlug, getRelatedNews } from "@/lib/news";

type Props = PageProps<"/tin-tuc/[slug]">;

export const dynamic = "force-dynamic";

async function getNewsBySlug(slug: string) {
  const cmsContent = await fetchPublicCmsContent();
  const mergedNews = mergeById(staticNews, cmsContent.news, true);
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
    openGraph: {
      title: item.title,
      description: item.excerpt,
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
