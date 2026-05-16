import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với Công ty Cổ phần Xây dựng Hữu Thành - hotline, email, địa chỉ và form liên hệ trực tuyến.",
};

export default function Page() {
  return <ContactPage />;
}
