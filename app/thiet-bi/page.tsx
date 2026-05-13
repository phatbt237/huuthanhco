import type { Metadata } from "next";
import EquipmentPage from "./EquipmentPage";

export const metadata: Metadata = {
  title: "Thiết bị",
  description: "Hệ thống thiết bị thi công hiện đại của Hữu Thành - sà lan, cẩu nổi, máy ép cọc, tàu nạo vét.",
};

export default function Page() {
  return <EquipmentPage />;
}
