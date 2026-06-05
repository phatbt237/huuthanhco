"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/ImageUploadField";
import { canWrite } from "@/lib/permissions";
import {
  defaultSiteSettings,
  ForbiddenError,
  getSettingsFull,
  saveSettingsBulk,
  type AdminRole,
  type SettingRecord,
} from "@/lib/siteApi";
import { Field, NoPermission, Notice, PanelFrame, RefreshButton, TextAreaField } from "./AdminPanelUi";
import HomepageContentManagers from "./HomepageContentManagers";

const editableSettings = [
  { key: "company.name", label: "Tên công ty", type: "text" },
  { key: "company.phone", label: "Số điện thoại", type: "text" },
  { key: "company.email", label: "Email", type: "text" },
  { key: "company.facebook", label: "Facebook", type: "text" },
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
  { key: "hero.eyebrowEn", label: "Hero eyebrow tiếng Anh", type: "text" },
  { key: "hero.title", label: "Hero title", type: "text" },
  { key: "hero.titleEn", label: "Hero title tiếng Anh", type: "text" },
  { key: "hero.description", label: "Hero mô tả", type: "textarea" },
  { key: "hero.descriptionEn", label: "Hero mô tả tiếng Anh", type: "textarea" },
] as const;

export default function SettingsPanel({ token, role }: { token: string; role: AdminRole }) {
  const [settings, setSettings] = useState<Record<string, SettingRecord>>({});
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const refresh = () => {
    void getSettingsFull(token)
      .then((items) => setSettings(Object.fromEntries(items.map((item) => [item.key, item]))))
      .catch((err) => { if (err instanceof ForbiddenError) setForbidden(true); });
  };

  useEffect(refresh, [token]);

  const setValue = (key: string, value: string) => {
    setSettings((current) => ({
      ...current,
      [key]: { key, value, type: current[key]?.type ?? "text", valueEn: current[key]?.valueEn ?? null },
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setMessage("");
    refresh();
  };

  const save = async () => {
    const payload = editableSettings.map(({ key }) => settings[key] ?? { key, value: defaultSiteSettings[key] ?? "", type: "text" as const });
    await saveSettingsBulk(token, payload);
    setIsEditing(false);
    setMessage("Đã lưu cấu hình website.");
    refresh();
  };

  const saveHeroImages = async (urls: string[]) => {
    const value = urls.join("\n");
    setValue("hero.images", value);
    await saveSettingsBulk(token, [{ key: "hero.images", value, type: "text", valueEn: null }]);
    refresh();
  };

  const heroImagesPreview = useMemo(() => String(settings["hero.images"]?.value ?? "").split("\n").filter(Boolean), [settings]);

  if (forbidden) return <NoPermission />;

  return (
    <PanelFrame
      title="Cấu hình website"
      action={
        <div className="flex items-center gap-2">
          {canWrite(role, "settings") && (
            !isEditing ? (
              <button onClick={() => setShowEditConfirm(true)} className="inline-flex h-9 items-center gap-2 bg-slate-800 px-3 text-sm font-black text-white hover:bg-slate-900">
                <AlertTriangle size={15} />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button onClick={cancelEdit} className="inline-flex h-9 items-center px-3 text-sm font-bold text-slate-600 hover:text-slate-900">
                  Huỷ
                </button>
                <button onClick={() => void save()} className="inline-flex h-9 items-center gap-2 bg-orange-500 px-3 text-sm font-black text-white hover:bg-orange-600">
                  <Save size={15} />
                  Lưu cấu hình
                </button>
              </>
            )
          )}
          <RefreshButton onClick={refresh} />
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_22rem]">
        <div className="border border-slate-200 bg-white p-5">
          {!isEditing ? (
            <div className="grid grid-cols-1 gap-3">
              {editableSettings.map(({ key, label }) => {
                const val = settings[key]?.value ?? defaultSiteSettings[key] ?? "";
                return (
                  <div key={key}>
                    <div className="mb-0.5 text-xs font-black uppercase text-slate-500">{label}</div>
                    <div className="min-h-[2.5rem] whitespace-pre-wrap break-all border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">{val || <span className="text-slate-400 italic">Chưa có</span>}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {editableSettings.map((item) =>
                item.type === "textarea" ? (
                  <TextAreaField key={item.key} label={item.label} value={settings[item.key]?.value ?? defaultSiteSettings[item.key] ?? ""} onChange={(value) => setValue(item.key, value)} />
                ) : (
                  <Field key={item.key} label={item.label} value={settings[item.key]?.value ?? defaultSiteSettings[item.key] ?? ""} onChange={(value) => setValue(item.key, value)} />
                )
              )}
            </div>
          )}
          {message && <Notice>{message}</Notice>}
        </div>

        {showEditConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <AlertTriangle size={20} className="shrink-0 text-orange-500" />
                <span className="font-black text-slate-950">Xác nhận chỉnh sửa</span>
              </div>
              <div className="px-5 py-5 text-sm text-slate-600">
                Bạn có muốn chỉnh sửa thông tin cấu hình website không? Hãy chắc chắn rằng bạn biết mình đang làm gì.
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
                <button onClick={() => setShowEditConfirm(false)} className="inline-flex h-10 items-center px-4 text-sm font-bold text-slate-600 hover:text-slate-900">
                  Không
                </button>
                <button
                  onClick={() => { setShowEditConfirm(false); setIsEditing(true); }}
                  className="inline-flex h-10 items-center gap-2 bg-slate-800 px-4 text-sm font-black text-white hover:bg-slate-900"
                >
                  Có, cho tôi chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black">Flash / Slideshow trang chủ</h3>
            <span className="text-xs text-slate-400">{heroImagesPreview.length} ảnh</span>
          </div>

          {canWrite(role, "settings") && (
            <ImageUploadField
              label="Tải lên ảnh mới"
              value=""
              onChange={(url) => { if (url) void saveHeroImages([...heroImagesPreview, url]); }}
              folder="banners"
              token={token}
              altText=""
              altTextEn=""
            />
          )}

          <div className="mt-4 space-y-2">
            {heroImagesPreview.length === 0 && <p className="text-sm italic text-slate-400">Chưa có ảnh flash nào.</p>}
            {heroImagesPreview.map((src, i) => (
              <div key={src} className="group relative">
                <img src={src} alt="" className="h-24 w-full object-cover" />
                {canWrite(role, "settings") && (
                  <div className="absolute inset-0 flex items-center justify-end gap-1.5 bg-black/0 px-2 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <button
                      disabled={i === 0}
                      onClick={() => {
                        const next = [...heroImagesPreview];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        void saveHeroImages(next);
                      }}
                      className="flex h-7 w-7 items-center justify-center bg-white/90 text-slate-700 disabled:opacity-30 hover:bg-white"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      disabled={i === heroImagesPreview.length - 1}
                      onClick={() => {
                        const next = [...heroImagesPreview];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        void saveHeroImages(next);
                      }}
                      className="flex h-7 w-7 items-center justify-center bg-white/90 text-slate-700 disabled:opacity-30 hover:bg-white"
                    >
                      <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => void saveHeroImages(heroImagesPreview.filter((_, idx) => idx !== i))}
                      className="flex h-7 w-7 items-center justify-center bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomepageContentManagers token={token} role={role} settings={settings} onSaved={refresh} />
    </PanelFrame>
  );
}
