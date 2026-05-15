import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPage from "./SearchPage";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  description: "Tìm kiếm thông tin dự án, thiết bị, tin tức và thông tin của Hữu Thành.",
};

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
