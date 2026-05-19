import type { Metadata } from "next";
import NewsDetailPage from "./NewsDetailPage";
import { news } from "@/data/news";
import { findStaticNewsBySlug, getNewsSlug, getRelatedStaticNews } from "@/lib/news";

type Props = PageProps<"/tin-tuc/[slug]">;

export function generateStaticParams() {
  return news.map((item) => ({ slug: getNewsSlug(item) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = findStaticNewsBySlug(slug);
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
  const item = findStaticNewsBySlug(slug);
  if (!item) return <NewsDetailPage slug={slug} />;

  return <NewsDetailPage item={item} relatedNews={getRelatedStaticNews(item)} />;
}
