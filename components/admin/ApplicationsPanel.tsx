"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Download, Eye, FileText, Mail, Phone, UserRound } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  deleteJobApplication,
  ForbiddenError,
  getJobApplicationCvUrl,
  listJobApplications,
  updateJobApplicationStatus,
  type AdminRole,
  type JobApplicationRecord,
} from "@/lib/siteApi";
import {
  AdminDetailCard,
  AdminListShell,
  ApplicationStatusBadge,
  DeleteButton,
  DetailItem,
  MessageBox,
  NoPermission,
  Notice,
  PanelFrame,
  RowActions,
} from "./AdminPanelUi";

function getApplicationMessage(item: JobApplicationRecord) {
  return item.message
    .split("\n")
    .filter((line) => !/^CV:\s*/i.test(line.trim()))
    .join("\n")
    .trim();
}

function downloadSignedCv(url: string) {
  const link = document.createElement("a");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function ApplicationsPanel({ token, role }: { token: string; role: AdminRole }) {
  const [items, setItems] = useState<JobApplicationRecord[]>([]);
  const [selectedItem, setSelectedItem] = useState<JobApplicationRecord | null>(null);
  const [message, setMessage] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const refresh = () => {
    setMessage("");
    void listJobApplications(token)
      .then((result) => {
        setItems(result.data);
        setSelectedItem((current) => {
          if (!current) return null;
          return result.data.find((item) => item.id === current.id) ?? null;
        });
      })
      .catch((err) => {
        if (err instanceof ForbiddenError) { setForbidden(true); return; }
        setMessage(err.message || "Không tải được hồ sơ ứng tuyển.");
      });
  };
  useEffect(refresh, [token]);

  const markAsViewed = async (item: JobApplicationRecord) => {
    if (!canWrite(role, "applications") || item.status !== "new") return item;
    const updated = await updateJobApplicationStatus(token, item.id, "reviewing");
    setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
    return updated;
  };

  const openDetail = async (item: JobApplicationRecord) => {
    setMessage("");
    try {
      setSelectedItem(await markAsViewed(item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không mở được hồ sơ.");
    }
  };

  const viewCv = async (item: JobApplicationRecord) => {
    if (!item.hasCv) return;
    const viewer = window.open("", "_blank");
    try {
      await markAsViewed(item);
      const access = await getJobApplicationCvUrl(token, item.id);
      if (viewer) viewer.location.href = access.url;
      else window.open(access.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      viewer?.close();
      setMessage(error instanceof Error ? error.message : "Không mở được CV.");
    }
  };

  const downloadCv = async (item: JobApplicationRecord) => {
    if (!item.hasCv) return;
    try {
      await markAsViewed(item);
      const access = await getJobApplicationCvUrl(token, item.id, true);
      downloadSignedCv(access.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không tải được CV.");
    }
  };

  if (selectedItem) {
    return (
      <PanelFrame title="Hồ sơ tuyển dụng">
        {message && <Notice tone="error">{message}</Notice>}
        <AdminDetailCard
          eyebrow="Hồ sơ đang được xem"
          title={selectedItem.fullName}
          status={<ApplicationStatusBadge status={selectedItem.status} />}
          onBack={() => setSelectedItem(null)}
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DetailItem icon={<FileText size={16} />} label="Vị trí ứng tuyển" value={selectedItem.positionApplied || selectedItem.jobTitle || "Ứng tuyển"} />
            <DetailItem icon={<CalendarDays size={16} />} label="Ngày gửi" value={new Date(selectedItem.createdAt).toLocaleString("vi-VN")} />
            <DetailItem icon={<UserRound size={16} />} label="Người gửi" value={selectedItem.fullName} />
            <DetailItem icon={<Phone size={16} />} label="Số điện thoại" value={selectedItem.phone} />
            <DetailItem icon={<Mail size={16} />} label="Email liên hệ" value={selectedItem.email || "-"} />
          </div>

          <MessageBox label="Nội dung ứng tuyển" value={getApplicationMessage(selectedItem) || "-"} />

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedItem.hasCv ? (
              <>
                <button
                  onClick={() => void viewCv(selectedItem)}
                  className="inline-flex h-11 items-center gap-2 bg-orange-500 px-4 text-sm font-black text-white transition hover:bg-orange-600"
                >
                  <Eye size={16} />
                  Xem CV
                </button>
                <button
                  onClick={() => void downloadCv(selectedItem)}
                  className="inline-flex h-11 items-center gap-2 border border-slate-200 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Download size={16} />
                  Tải CV
                </button>
              </>
            ) : (
              <div className="text-sm font-semibold text-slate-400">Hồ sơ này chưa đính kèm CV.</div>
            )}
            {canDelete(role, "applications") && (
              <DeleteButton
                onClick={() => {
                  void deleteJobApplication(token, selectedItem.id).then(() => {
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
    <PanelFrame title="Hồ sơ tuyển dụng">
      {message && <Notice tone="error">{message}</Notice>}
      <AdminListShell
        title="Danh sách hồ sơ"
        description={`${items.length} hồ sơ đang hiển thị`}
        empty="Chưa có hồ sơ ứng tuyển."
        hasItems={items.length > 0}
      >
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="w-32 px-5 py-4 font-black">Thao tác</th>
              <th className="px-5 py-4 font-black">Họ tên</th>
              <th className="px-5 py-4 font-black">Số điện thoại</th>
              <th className="px-5 py-4 font-black">Email</th>
              <th className="px-5 py-4 font-black">Vị trí</th>
              <th className="px-5 py-4 font-black">Ngày gửi</th>
              <th className="px-5 py-4 font-black">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top transition hover:bg-orange-50/40">
                <td className="px-5 py-4">
                  <RowActions
                    onView={() => void openDetail(item)}
                    onDelete={canDelete(role, "applications") ? () => {
                      if (window.confirm("Xóa hồ sơ này?")) void deleteJobApplication(token, item.id).then(refresh);
                    } : undefined}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="font-black text-slate-950">{item.fullName}</div>
                </td>
                <td className="px-5 py-4 font-bold text-slate-700">{item.phone}</td>
                <td className="px-5 py-4 text-slate-700">{item.email || "-"}</td>
                <td className="px-5 py-4 text-slate-700">{item.positionApplied || item.jobTitle || "Ứng tuyển"}</td>
                <td className="px-5 py-4 text-slate-700">{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                <td className="px-5 py-4">
                  <ApplicationStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminListShell>
    </PanelFrame>
  );
}
