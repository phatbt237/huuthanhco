import type { Metadata } from "next";
import NewsPage from "./NewsPage";
import { fetchPublicCmsContent } from "@/lib/cmsContent";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức mới nhất từ Công ty Cổ phần Xây dựng Hữu Thành - dự án, giải thưởng, công nghệ thi công.",
};

export default async function Page() {
  const initialContent = await fetchPublicCmsContent().catch(() => undefined);
  return <NewsPage initialContent={initialContent} />;
}
