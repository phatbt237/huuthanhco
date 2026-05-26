"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  deleteConsultation,
  ForbiddenError,
  listConsultations,
  updateConsultationStatus,
  type AdminRole,
  type ConsultationRecord,
} from "@/lib/siteApi";
import {
  AdminDetailCard,
  AdminListShell,
  ContactStatusBadge,
  DeleteButton,
  DetailItem,
  MessageBox,
  NoPermission,
  Notice,
  PanelFrame,
  RowActions,
  SelectStatus,
} from "./AdminPanelUi";

export default function ContactsPanel({ token, role }: { token: string; role: AdminRole }) {
  const [items, setItems] = useState<ConsultationRecord[]>([]);
  const [selectedItem, setSelectedItem] = useState<ConsultationRecord | null>(null);
  const [message, setMessage] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const refresh = () => {
    setMessage("");
    void listConsultations(token)
      .then((result) => {
        setItems(result);
        setSelectedItem((current) => {
          if (!current) return null;
          return result.find((item) => item.id === current.id) ?? null;
        });
      })
      .catch((err) => {
        if (err instanceof ForbiddenError) { setForbidden(true); return; }
        setMessage(err.message || "Không tải được dữ liệu liên hệ.");
      });
  };
  useEffect(refresh, [token]);

  const openDetail = async (item: ConsultationRecord) => {
    setMessage("");
    try {
      const viewedItem = (item.status === "new" && canWrite(role, "contacts"))
        ? await updateConsultationStatus(token, item.id, "read")
        : item;
      setItems((current) => current.map((entry) => (entry.id === item.id ? viewedItem : entry)));
      setSelectedItem(viewedItem);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không mở được hộp thư.");
    }
  };

  if (selectedItem) {
    return (
      <PanelFrame title="Hộp thư liên hệ">
        {message && <Notice tone="error">{message}</Notice>}
        <AdminDetailCard
          eyebrow="Thư đang được xem"
          title={selectedItem.service || selectedItem.message?.split("\n")[0] || "Yêu cầu liên hệ"}
          status={<ContactStatusBadge status={selectedItem.status} />}
          onBack={() => setSelectedItem(null)}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DetailItem icon={<UserRound size={16} />} label="Người gửi" value={selectedItem.name} />
            <DetailItem icon={<Phone size={16} />} label="Số điện thoại" value={selectedItem.phone} />
            <DetailItem icon={<Mail size={16} />} label="Email liên hệ" value={selectedItem.email || "-"} />
            <DetailItem icon={<CalendarDays size={16} />} label="Ngày gửi" value={new Date(selectedItem.createdAt).toLocaleString("vi-VN")} />
          </div>

          <MessageBox label="Nội dung thư" value={selectedItem.message || "-"} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {canWrite(role, "contacts") && (
              <SelectStatus
                value={selectedItem.status}
                options={[
                  { value: "new", label: "Chưa xem" },
                  { value: "read", label: "Đã xem" },
                  { value: "done", label: "Đã xử lý" },
                ]}
                onChange={(status) => {
                  void updateConsultationStatus(token, selectedItem.id, status as ConsultationRecord["status"]).then((updated) => {
                    setSelectedItem(updated);
                    setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
                  });
                }}
              />
            )}
            {canDelete(role, "contacts") && (
              <DeleteButton
                onClick={() => {
                  void deleteConsultation(token, selectedItem.id).then(() => {
                    setSelectedItem(null);
                    refresh();
                  });
                }}
              />
            )}
          </div>
        </AdminDetailCard>
      </PanelFrame>
    );
  }

  if (forbidden) return <NoPermission />;

  return (
    <PanelFrame title="Hộp thư liên hệ">
      {message && <Notice tone="error">{message}</Notice>}
      <AdminListShell
        title="Danh sách thư liên hệ"
        description={`${items.length} thư đang hiển thị`}
        empty="Chưa có yêu cầu liên hệ."
        hasItems={items.length > 0}
      >
        <table className="w-full min-w-[62rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-5 py-4 font-black">Người gửi</th>
              <th className="px-5 py-4 font-black">Số điện thoại</th>
              <th className="px-5 py-4 font-black">Tiêu đề / nội dung</th>
              <th className="px-5 py-4 font-black">Ngày gửi</th>
              <th className="px-5 py-4 font-black">Tình trạng</th>
              <th className="w-32 px-5 py-4 font-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top transition hover:bg-orange-50/40">
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{item.name}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">{item.email || "Chưa có email"}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{item.phone}</td>
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900">{item.service || "Yêu cầu liên hệ"}</div>
                  <div className="mt-1 line-clamp-2 max-w-xl text-slate-500">{item.message || "-"}</div>
                </td>
                <td className="px-5 py-4 text-slate-600">{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                <td className="px-5 py-4">
                  <ContactStatusBadge status={item.status} />
                </td>
                <td className="px-5 py-4">
                  <RowActions
                    onView={() => void openDetail(item)}
                    onDelete={canDelete(role, "contacts") ? () => {
                      if (window.confirm("Xóa thư liên hệ này?")) void deleteConsultation(token, item.id).then(refresh);
                    } : undefined}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminListShell>
    </PanelFrame>
  );
}
