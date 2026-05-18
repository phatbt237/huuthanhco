import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginPage } from "../../AdminPage";

export const metadata: Metadata = {
  title: "Đăng nhập Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
