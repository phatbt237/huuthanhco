import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsPage from "./ProjectsPage";
import { fetchPublicCmsContent } from "@/lib/cmsContent";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Danh sách các dự án thi công của Công ty Cổ phần Xây dựng Hữu Thành - cầu đường, cảng biển, thủy lợi.",
};

export default async function Page() {
  const initialContent = await fetchPublicCmsContent();

  return (
    <Suspense>
      <ProjectsPage initialContent={initialContent} />
    </Suspense>
  );
}
