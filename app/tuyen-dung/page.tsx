import type { Metadata } from "next";
import CareersPage from "./CareersPage";
import { fetchPublicCmsContent } from "@/lib/cmsContent";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Cơ hội việc làm tại Hữu Thành - kỹ sư công trình, giám sát thi công, thuyền trưởng.",
};

export default async function Page() {
  const initialContent = await fetchPublicCmsContent().catch(() => undefined);
  return <CareersPage initialContent={initialContent} />;
}
