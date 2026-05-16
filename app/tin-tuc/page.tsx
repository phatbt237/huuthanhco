import type { Metadata } from "next";
import NewsPage from "./NewsPage";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức mới nhất từ Công ty Cổ phần Xây dựng Hữu Thành - dự án, giải thưởng, công nghệ thi công.",
};

export default function Page() {
  return <NewsPage />;
}
