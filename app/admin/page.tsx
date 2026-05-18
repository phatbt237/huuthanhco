import type { Metadata } from "next";
import AdminPage from "./AdminPage";

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminPage />;
}
