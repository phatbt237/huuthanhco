import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Tìm hiểu về lịch sử hình thành, tầm nhìn và sứ mệnh của Công ty TNHH Xây dựng Hữu Thành - đơn vị thi công hàng đầu miền Nam.",
};

export default function Page() {
  return <AboutPage />;
}
