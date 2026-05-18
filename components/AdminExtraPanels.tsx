"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
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
  { key: "company.address", label: "Địa chỉ", type: "text" },
  { key: "company.workingHours", label: "Giờ làm việc", type: "text" },
  { key: "company.mapEmbedUrl", label: "Google Map embed URL", type: "text" },
  { key: "hero.eyebrow", label: "Hero eyebrow", type: "text" },
  { key: "hero.title", label: "Hero title", type: "text" },
  { key: "hero.description", label: "Hero mô tả", type: "textarea" },
  { key: "hero.images", label: "Flash/banner trang chủ, mỗi dòng một URL", type: "textarea" },
] as const;

export default function AdminExtraPanels({ tab, token, currentUserId }: { tab: ExtraAdminTab; token: string; currentUserId: string }) {
  if (tab === "accounts") return <AccountsPanel token={token} currentUserId={currentUserId} />;
  if (tab === "contacts") return <ContactsPanel token={token} />;
  if (tab === "applications") return <ApplicationsPanel token={token} />;
  return <SettingsPanel token={token} />;
}

function AccountsPanel({ token, currentUserId }: { token: string; currentUserId: string }) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "editor" as AdminRole });
  const [message, setMessage] = useState("");

  const refresh = () => void listAdminUsers(token).then(setUsers).catch((err) => setMessage(err.message));

  useEffect(refresh, [token]);

  const submit = async () => {
    setMessage("");
    await createAdminUser(token, form);
    setForm({ email: "", password: "", fullName: "", role: "editor" });
    setMessage("Đã tạo tài khoản.");
    refresh();
  };

  return (
    <PanelFrame title="Tài khoản quản trị" action={<RefreshButton onClick={refresh} />}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-black">Tạo tài khoản mới</h3>
          <div className="space-y-3">
            <Field label="Họ tên" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="Mật khẩu" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Quyền</span>
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })} className="h-11 w-full border border-slate-200 px-3 text-sm">
                <option value="editor">Editor</option>
                <option value="hr">HR</option>
                <option value="viewer">Viewer</option>
                <option value="super_admin">Super admin</option>
              </select>
            </label>
            <button onClick={submit} className="inline-flex h-11 items-center gap-2 bg-orange-500 px-4 text-sm font-black text-white">
              <Plus size={16} />
              Tạo tài khoản
            </button>
          </div>
        </div>

        <div className="border border-slate-200 bg-white">
          <Table
            headers={["Họ tên", "Email", "Quyền", ""]}
            rows={users.map((user) => [
              user.fullName || "-",
              user.email,
              user.role,
              <button
                key={user.id}
                disabled={user.id === currentUserId}
                onClick={() => {
                  if (window.confirm("Xóa tài khoản này?")) {
                    void deleteAdminUser(token, user.id).then(refresh);
                  }
                }}
                className="text-sm font-bold text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Xóa
              </button>,
            ])}
          />
        </div>
      </div>
      {message && <Notice>{message}</Notice>}
    </PanelFrame>
  );
}

function ContactsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<ConsultationRecord[]>([]);
  const refresh = () => void listConsultations(token).then(setItems);
  useEffect(refresh, [token]);

  return (
    <PanelFrame title="Thông tin liên hệ gửi về" action={<RefreshButton onClick={refresh} />}>
      <RecordList
        empty="Chưa có yêu cầu liên hệ."
        items={items.map((item) => ({
          id: item.id,
          title: item.name,
          meta: `${item.phone}${item.email ? ` - ${item.email}` : ""}`,
          status: item.status,
          body: item.message,
          createdAt: item.createdAt,
          actions: (
            <>
              <SelectStatus value={item.status} options={["new", "read", "done"]} onChange={(status) => void updateConsultationStatus(token, item.id, status as ConsultationRecord["status"]).then(refresh)} />
              <DeleteButton onClick={() => void deleteConsultation(token, item.id).then(refresh)} />
            </>
          ),
        }))}
      />
    </PanelFrame>
  );
}

function ApplicationsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<JobApplicationRecord[]>([]);
  const refresh = () => void listJobApplications(token).then((result) => setItems(result.data));
  useEffect(refresh, [token]);

  return (
    <PanelFrame title="Hồ sơ tuyển dụng" action={<RefreshButton onClick={refresh} />}>
      <RecordList
        empty="Chưa có hồ sơ ứng tuyển."
        items={items.map((item) => ({
          id: item.id,
          title: item.fullName,
          meta: `${item.phone}${item.email ? ` - ${item.email}` : ""}`,
          status: item.status,
          body: `${item.positionApplied || item.jobTitle || "Ứng tuyển"}${item.cvFileUrl ? `\nCV: ${item.cvFileUrl}` : ""}${item.message ? `\n${item.message}` : ""}`,
          createdAt: item.createdAt,
          actions: (
            <>
              <SelectStatus value={item.status} options={["new", "reviewing", "interviewed", "hired", "rejected"]} onChange={(status) => void updateJobApplicationStatus(token, item.id, status as JobApplicationRecord["status"]).then(refresh)} />
              <DeleteButton onClick={() => void deleteJobApplication(token, item.id).then(refresh)} />
            </>
          ),
        }))}
      />
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
  items: Array<{ id: string; title: string; meta: string; status: string; body: string; createdAt: string; actions: React.ReactNode }>;
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
        </article>
      ))}
    </div>
  );
}

function SelectStatus({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 border border-slate-200 px-2 text-sm font-bold">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
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

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-700">{children}</div>;
}
