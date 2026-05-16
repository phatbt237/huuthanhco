import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsPage from "./ProjectsPage";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Danh sách các dự án thi công của Công ty Cổ phần Xây dựng Hữu Thành - cầu đường, cảng biển, thủy lợi.",
};

export default function Page() {
  return (
    <Suspense>
      <ProjectsPage />
    </Suspense>
  );
}
