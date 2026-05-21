"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Download, Eye, FileText, Mail, Phone, Plus, RefreshCw, Save, Search, Trash2, UserRound } from "lucide-react";
import {
  createAdminUser,
  createMedia,
  defaultSiteSettings,
  deleteAdminUser,
  deleteConsultation,
  deleteJobApplication,
  deleteMedia,
  getSettingsFull,
  listAdminUsers,
  listConsultations,
  listJobApplications,
  listMedia,
  saveSettingsBulk,
  updateConsultationStatus,
  updateAdminUser,
  updateJobApplicationStatus,
  type AdminRole,
  type AdminUserRecord,
  type ConsultationRecord,
  type JobApplicationRecord,
  type MediaRecord,
  type SettingRecord,
} from "@/lib/siteApi";

export type ExtraAdminTab = "accounts" | "contacts" | "applications" | "settings";

const editableSettings = [
  { key: "company.name", label: "Tên công ty", type: "text" },
  { key: "company.phone", label: "Số điện thoại", type: "text" },
  { key: "company.email", label: "Email", type: "text" },
  { key: "company.taxCode", label: "Mã số thuế", type: "text" },
  { key: "company.headOffice", label: "Trụ sở", type: "text" },
  { key: "company.headOfficeEn", label: "Trụ sở tiếng Anh", type: "text" },
  { key: "company.transactionOffice", label: "Văn phòng giao dịch", type: "text" },
  { key: "company.transactionOfficeEn", label: "Văn phòng giao dịch tiếng Anh", type: "text" },
  { key: "company.address", label: "Địa chỉ chính", type: "text" },
  { key: "company.addressEn", label: "Địa chỉ chính tiếng Anh", type: "text" },
  { key: "company.workingHours", label: "Giờ làm việc", type: "text" },
  { key: "company.mapEmbedUrl", label: "Google Map embed URL", type: "text" },
  { key: "hero.eyebrow", label: "Hero eyebrow", type: "text" },
  { key: "hero.title", label: "Hero title", type: "text" },
  { key: "hero.description", label: "Hero mô tả", type: "textarea" },
  { key: "hero.images", label: "Flash/banner trang chủ, mỗi dòng một URL", type: "textarea" },
  { key: "services.items", label: "Dịch vụ/Lĩnh vực dạng JSON", type: "textarea" },
  { key: "equipment.items", label: "Thiết bị dạng JSON", type: "textarea" },
  { key: "partners.images", label: "Logo đối tác, mỗi dòng một URL", type: "textarea" },
] as const;

const applicationStatusOptions = [
  { value: "new", label: "Chưa xem" },
  { value: "reviewing", label: "Đã xem" },
  { value: "interviewed", label: "Đã phỏng vấn" },
  { value: "hired", label: "Đã tuyển" },
  { value: "rejected", label: "Từ chối" },
];

export default function AdminExtraPanels({ tab, token, currentUserId }: { tab: ExtraAdminTab; token: string; currentUserId: string }) {
  if (tab === "accounts") return <AccountsPanel token={token} currentUserId={currentUserId} />;
  if (tab === "contacts") return <ContactsPanel token={token} />;
  if (tab === "applications") return <ApplicationsPanel token={token} />;
  return <SettingsPanel token={token} />;
}

function AccountsPanel({ token, currentUserId }: { token: string; currentUserId: string }) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "editor" as AdminRole });
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const refresh = () => void listAdminUsers(token).then(setUsers).catch((err) => setMessage(err.message));

  useEffect(refresh, [token]);

  const filteredUsers = users.filter((user) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return [user.fullName, user.email, user.role].some((value) => String(value ?? "").toLowerCase().includes(keyword));
  });

  const submit = async () => {
    setMessage("");
    if (editingUserId) {
      await updateAdminUser(token, editingUserId, {
        email: form.email,
        fullName: form.fullName,
        role: form.role,
        ...(form.password.trim() ? { password: form.password } : {}),
      });
    } else {
      await createAdminUser(token, form);
    }
    setForm({ email: "", password: "", fullName: "", role: "editor" });
    setEditingUserId(null);
    setIsCreating(false);
    setMessage(editingUserId ? "Đã cập nhật tài khoản." : "Đã tạo tài khoản.");
    refresh();
  };

  const openCreateForm = () => {
    setMessage("");
    setEditingUserId(null);
    setForm({ email: "", password: "", fullName: "", role: "editor" });
    setIsCreating(true);
  };

  const openEditForm = (user: AdminUserRecord) => {
    setMessage("");
    setEditingUserId(user.id);
    setForm({ email: user.email, password: "", fullName: user.fullName || "", role: user.role });
    setIsCreating(true);
  };

  const closeForm = () => {
    setEditingUserId(null);
    setForm({ email: "", password: "", fullName: "", role: "editor" });
    setIsCreating(false);
  };

  return (
    <PanelFrame title="Tài khoản quản trị">
      {message && <Notice>{message}</Notice>}
      {isCreating && (
        <div className="mb-5 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">{editingUserId ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {editingUserId ? "Cập nhật thông tin và quyền quản trị." : "Thêm tài khoản quản trị cho nội dung website."}
              </p>
            </div>
            <button
              onClick={closeForm}
              className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
          </div>
            <div className="space-y-3">
            <Field label="Họ tên" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field
              label={editingUserId ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
              type="password"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
            />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Quyền</span>
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })} className="h-11 w-full border border-slate-200 px-3 text-sm">
                <option value="editor">Editor</option>
                <option value="hr">HR</option>
                <option value="viewer">Viewer</option>
                <option value="super_admin">Chức năng cao nhất</option>
              </select>
            </label>
            <button onClick={submit} className="inline-flex h-11 items-center gap-2 bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700">
              <Plus size={16} />
              {editingUserId ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Danh sách tài khoản</h3>
            <p className="mt-1 text-sm font-semibold text-slate-400">{filteredUsers.length} tài khoản đang hiển thị</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="h-12 w-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-orange-300 sm:w-80"
              />
            </label>
            <button
              onClick={openCreateForm}
              className="inline-flex h-12 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700"
            >
              <Plus size={17} />
              Tạo mới
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-4 font-black">Họ tên</th>
                <th className="px-5 py-4 font-black">Email</th>
                <th className="px-5 py-4 font-black">Quyền</th>
                <th className="px-5 py-4 font-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 transition hover:bg-orange-50/40">
                  <td className="px-5 py-4 font-bold text-slate-900">{user.fullName || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{formatAdminRole(user.role)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditForm(user)}
                        className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        disabled={user.id === currentUserId}
                        onClick={() => {
                          if (window.confirm("Xóa tài khoản này?")) {
                            void deleteAdminUser(token, user.id).then(refresh);
                          }
                        }}
                        className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300"
                      >
                        <Trash2 size={15} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm font-semibold text-slate-400">
                    Không có tài khoản phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PanelFrame>
  );
}

function ContactsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<ConsultationRecord[]>([]);
  const [selectedItem, setSelectedItem] = useState<ConsultationRecord | null>(null);
  const [message, setMessage] = useState("");
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
      .catch((err) => setMessage(err.message || "Không tải được dữ liệu liên hệ."));
  };
  useEffect(refresh, [token]);

  const openDetail = async (item: ConsultationRecord) => {
    setMessage("");
    try {
      const viewedItem = item.status === "new" ? await updateConsultationStatus(token, item.id, "read") : item;
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
            <DeleteButton
              onClick={() => {
                void deleteConsultation(token, selectedItem.id).then(() => {
                  setSelectedItem(null);
                  refresh();
                });
              }}
            />
          </div>
        </AdminDetailCard>
      </PanelFrame>
    );
  }

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
              <th className="w-32 px-5 py-4 font-black">Thao tác</th>
              <th className="px-5 py-4 font-black">Người gửi</th>
              <th className="px-5 py-4 font-black">Số điện thoại</th>
              <th className="px-5 py-4 font-black">Tiêu đề / nội dung</th>
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
                    onDelete={() => {
                      if (window.confirm("Xóa thư liên hệ này?")) void deleteConsultation(token, item.id).then(refresh);
                    }}
                  />
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </AdminListShell>
    </PanelFrame>
  );
}

function ApplicationsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<JobApplicationRecord[]>([]);
  const [selectedItem, setSelectedItem] = useState<JobApplicationRecord | null>(null);
  const [message, setMessage] = useState("");
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
      .catch((err) => setMessage(err.message || "Không tải được hồ sơ ứng tuyển."));
  };
  useEffect(refresh, [token]);

  const markAsViewed = async (item: JobApplicationRecord) => {
    if (item.status !== "new") return item;
    const updated = await updateJobApplicationStatus(token, item.id, "reviewing");
    setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
    return updated;
  };

  const openDetail = async (item: JobApplicationRecord) => {
    setMessage("");
    try {
      const viewedItem = await markAsViewed(item);
      setSelectedItem(viewedItem);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không mở được hồ sơ.");
    }
  };

  const viewCv = async (item: JobApplicationRecord) => {
    if (!item.cvFileUrl) return;
    const viewer = window.open("", "_blank");
    try {
      await markAsViewed(item);
      openCvFile(item.cvFileUrl, getCvFileName(item), viewer);
    } catch (error) {
      viewer?.close();
      setMessage(error instanceof Error ? error.message : "Không mở được CV.");
    }
  };

  const downloadCv = async (item: JobApplicationRecord) => {
    if (!item.cvFileUrl) return;
    try {
      await markAsViewed(item);
      downloadCvFile(item.cvFileUrl, getCvFileName(item));
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
            {selectedItem.cvFileUrl ? (
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
            <DeleteButton
              onClick={() => {
                void deleteJobApplication(token, selectedItem.id).then(() => {
                  setSelectedItem(null);
                  refresh();
                });
              }}
            />
          </div>
        </AdminDetailCard>
      </PanelFrame>
    );
  }

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
                      onDelete={() => {
                        if (window.confirm("Xóa hồ sơ này?")) void deleteJobApplication(token, item.id).then(refresh);
                      }}
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

function SettingsPanel({ token }: { token: string }) {
  const [settings, setSettings] = useState<Record<string, SettingRecord>>({});
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [mediaForm, setMediaForm] = useState({ fileName: "", fileUrl: "", folder: "banners", altText: "" });
  const [message, setMessage] = useState("");

  const refresh = () => {
    void getSettingsFull(token).then((items) => setSettings(Object.fromEntries(items.map((item) => [item.key, item]))));
    void listMedia(token).then(setMedia);
  };

  useEffect(refresh, [token]);

  const setValue = (key: string, value: string) => {
    setSettings((current) => ({
      ...current,
      [key]: { key, value, type: current[key]?.type ?? "text", valueEn: current[key]?.valueEn ?? null },
    }));
  };

  const save = async () => {
    const payload = editableSettings.map(({ key }) => settings[key] ?? { key, value: defaultSiteSettings[key] ?? "", type: "text" as const });
    await saveSettingsBulk(token, payload);
    setMessage("Đã lưu cấu hình website.");
    refresh();
  };

  const addMedia = async () => {
    await createMedia(token, {
      fileName: mediaForm.fileName || mediaForm.fileUrl.split("/").pop() || "media",
      fileUrl: mediaForm.fileUrl,
      fileType: mediaForm.fileUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i) ? "image" : "file",
      folder: mediaForm.folder,
      altText: mediaForm.altText,
      altTextEn: mediaForm.altText,
    });
    setMediaForm({ fileName: "", fileUrl: "", folder: "banners", altText: "" });
    refresh();
  };

  const heroImagesPreview = useMemo(() => String(settings["hero.images"]?.value ?? "").split("\n").filter(Boolean), [settings]);

  return (
    <PanelFrame title="Cấu hình website" action={<RefreshButton onClick={refresh} />}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_22rem]">
        <div className="border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4">
            {editableSettings.map((item) =>
              item.type === "textarea" ? (
                <TextAreaField key={item.key} label={item.label} value={settings[item.key]?.value ?? defaultSiteSettings[item.key] ?? ""} onChange={(value) => setValue(item.key, value)} />
              ) : (
                <Field key={item.key} label={item.label} value={settings[item.key]?.value ?? defaultSiteSettings[item.key] ?? ""} onChange={(value) => setValue(item.key, value)} />
              )
            )}
          </div>
          <button onClick={save} className="mt-5 inline-flex h-11 items-center gap-2 bg-orange-500 px-4 text-sm font-black text-white">
            <Save size={16} />
            Lưu cấu hình
          </button>
          {message && <Notice>{message}</Notice>}
        </div>

        <div className="space-y-4">
          <div className="border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-black">Media / banner</h3>
            <div className="space-y-3">
              <Field label="Tên file" value={mediaForm.fileName} onChange={(value) => setMediaForm({ ...mediaForm, fileName: value })} />
              <Field label="URL file" value={mediaForm.fileUrl} onChange={(value) => setMediaForm({ ...mediaForm, fileUrl: value })} />
              <Field label="Folder" value={mediaForm.folder} onChange={(value) => setMediaForm({ ...mediaForm, folder: value })} />
              <Field label="Alt text" value={mediaForm.altText} onChange={(value) => setMediaForm({ ...mediaForm, altText: value })} />
              <button onClick={addMedia} className="inline-flex h-10 items-center gap-2 bg-slate-950 px-3 text-sm font-black text-white">
                <Plus size={16} />
                Thêm media
              </button>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-black">Flash hiện tại</h3>
            <div className="space-y-2">
              {heroImagesPreview.slice(0, 5).map((src) => (
                <img key={src} src={src} alt="" className="h-20 w-full object-cover" />
              ))}
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-black">Media đã lưu</h3>
            <div className="space-y-2">
              {media.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border border-slate-100 p-2 text-sm">
                  <span className="truncate">{item.fileName}</span>
                  <button onClick={() => void deleteMedia(token, item.id).then(refresh)} className="text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}

function PanelFrame({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AdminListShell({
  title,
  description,
  empty,
  hasItems,
  children,
}: {
  title: string;
  description: string;
  empty: string;
  hasItems: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-400">{description}</p>
        </div>
      </div>
      {!hasItems ? (
        <div className="p-10 text-center text-sm font-semibold text-slate-400">{empty}</div>
      ) : (
        <div className="overflow-auto">{children}</div>
      )}
    </div>
  );
}

function AdminDetailCard({
  eyebrow,
  title,
  status,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  status: React.ReactNode;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-white px-6 py-6">
        <button
          onClick={onBack}
          className="mb-5 inline-flex h-10 items-center gap-2 border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.28em] text-orange-500">{eyebrow}</div>
            <h3 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950">{title}</h3>
          </div>
          <div className="shrink-0">{status}</div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function RowActions({ onView, onDelete }: { onView: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onView}
        className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
      >
        <Eye size={15} />
        Xem
      </button>
      <button
        onClick={onDelete}
        className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100"
      >
        <Trash2 size={15} />
        Xóa
      </button>
    </div>
  );
}

function MessageBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">{label}</div>
      <div className="min-h-32 whitespace-pre-line border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">{value}</div>
    </div>
  );
}

function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-3 text-sm font-black text-slate-700">
      <RefreshCw size={15} />
      Tải lại
    </button>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-orange-400" />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <textarea value={value} rows={5} onChange={(event) => onChange(event.target.value)} className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
    </label>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-black">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-100">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordList({
  items,
  empty,
}: {
  empty: string;
  items: Array<{ id: string; title: string; meta: string; status: string; body: string; createdAt: string; actions: React.ReactNode; extra?: React.ReactNode }>;
}) {
  if (!items.length) return <div className="border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-400">{empty}</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-black">{item.title}</div>
              <div className="mt-1 text-sm font-semibold text-slate-500">{item.meta}</div>
              <div className="mt-1 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString("vi-VN")}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">{item.actions}</div>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">{item.body || "-"}</p>
          {item.extra}
        </article>
      ))}
    </div>
  );
}

type StatusOption = string | { value: string; label: string };

function SelectStatus({ value, options, onChange }: { value: string; options: StatusOption[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 border border-slate-200 px-2 text-sm font-bold">
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
      })}
    </select>
  );
}

function formatAdminRole(role: AdminRole) {
  const labels: Record<AdminRole, string> = {
    super_admin: "Chức năng cao nhất",
    editor: "Editor",
    hr: "HR",
    viewer: "Viewer",
  };
  return labels[role];
}

function getApplicationStatusLabel(status: string) {
  return applicationStatusOptions.find((option) => option.value === status)?.label ?? status;
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const isNew = status === "new";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${isNew ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
      {getApplicationStatusLabel(status)}
    </span>
  );
}

function ContactStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    new: "Chưa xem",
    read: "Đã xem",
    done: "Đã xử lý",
  };
  const className =
    status === "new"
      ? "bg-red-50 text-red-700"
      : status === "done"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${className}`}>{labels[status] ?? status}</span>;
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        {icon ? <span className="text-orange-500">{icon}</span> : null}
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-bold text-slate-800">{value}</div>
    </div>
  );
}

function getCvFileName(item: JobApplicationRecord) {
  const fromMessage = item.message.match(/CV:\s*(.+)$/im)?.[1]?.trim();
  if (fromMessage) return fromMessage;

  try {
    const parsed = new URL(item.cvFileUrl ?? "", window.location.origin);
    const fileName = decodeURIComponent(parsed.pathname.split("/").pop() || "");
    return fileName || "cv-ung-tuyen.pdf";
  } catch {
    return "cv-ung-tuyen.pdf";
  }
}

function getApplicationMessage(item: JobApplicationRecord) {
  return item.message
    .split("\n")
    .filter((line) => !/^CV:\s*/i.test(line.trim()))
    .join("\n")
    .trim();
}

function dataUrlToObjectUrl(dataUrl: string) {
  const [meta = "", payload = ""] = dataUrl.split(",");
  const mimeType = meta.match(/^data:([^;]+)/)?.[1] || "application/octet-stream";
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}

function getOpenableCvUrl(fileUrl: string) {
  if (!fileUrl.startsWith("data:")) return { url: fileUrl, shouldRevoke: false };
  return { url: dataUrlToObjectUrl(fileUrl), shouldRevoke: true };
}

function openCvFile(fileUrl: string, fileName: string, targetWindow: Window | null) {
  const { url, shouldRevoke } = getOpenableCvUrl(fileUrl);
  if (targetWindow) {
    targetWindow.document.title = fileName;
    targetWindow.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  if (shouldRevoke) window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function downloadCvFile(fileUrl: string, fileName: string) {
  const { url, shouldRevoke } = getOpenableCvUrl(fileUrl);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (shouldRevoke) window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
        if (window.confirm("Xóa mục này?")) onClick();
      }}
      className="inline-flex h-9 items-center gap-1 border border-red-200 px-2 text-sm font-bold text-red-600"
    >
      <Trash2 size={15} />
      Xóa
    </button>
  );
}

function Notice({ children, tone = "success" }: { children: React.ReactNode; tone?: "success" | "error" }) {
  return (
    <div className={`my-4 border p-3 text-sm font-bold ${tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
      {children}
    </div>
  );
}
