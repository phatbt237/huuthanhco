import type { Metadata } from "next";
import CareersPage from "./CareersPage";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Cơ hội việc làm tại Hữu Thành - kỹ sư công trình, giám sát thi công, thuyền trưởng.",
};

export default function Page() {
  return <CareersPage />;
}
