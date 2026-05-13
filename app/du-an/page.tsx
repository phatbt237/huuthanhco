import type { Metadata } from "next";
import ProjectsPage from "./ProjectsPage";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Danh sách các dự án thi công của Công ty TNHH Xây dựng Hữu Thành - cầu đường, cảng biển, thủy lợi.",
};

export default function Page() {
  return <ProjectsPage />;
}
