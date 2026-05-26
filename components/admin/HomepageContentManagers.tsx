"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/ImageUploadField";
import { equipment as fallbackEquipment, type Equipment } from "@/data/equipment";
import { services as fallbackServices, type Service } from "@/data/services";
import { canWrite } from "@/lib/permissions";
import { defaultSiteSettings, saveSettingsBulk, type AdminRole, type SettingRecord } from "@/lib/siteApi";

type Props = {
  token: string;
  role: AdminRole;
  settings: Record<string, SettingRecord>;
  onSaved: () => void;
};

const inputClassName = "h-10 w-full border border-slate-200 px-3 text-sm outline-none focus:border-orange-400";
const textAreaClassName = "w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400";

function parseItems<T>(settings: Record<string, SettingRecord>, key: string, fallback: T[]) {
  const raw = settings[key]?.value ?? defaultSiteSettings[key];
  try {
    const value = JSON.parse(String(raw ?? "[]")) as unknown;
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function settingLines(settings: Record<string, SettingRecord>, key: string) {
  return String(settings[key]?.value ?? defaultSiteSettings[key] ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-500">{children}</span>;
}

function ManagerShell({
  title,
  description,
  count,
  children,
  actions,
}: {
  title: string;
  description: string;
  count: number;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">{count} mục</span>
          {actions}
        </div>
      </div>
      {children}
    </section>
  );
}

function EditorActions({
  index,
  count,
  onMove,
  onDelete,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"
        aria-label="Đưa lên"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onMove(1)}
        className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"
        aria-label="Đưa xuống"
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
        aria-label="Xóa"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function HomepageContentManagers({ token, role, settings, onSaved }: Props) {
  const writable = canWrite(role, "settings");
  const [services, setServices] = useState<Service[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [savingKey, setSavingKey] = useState("");

  const servicesRaw = settings["services.items"]?.value ?? defaultSiteSettings["services.items"] ?? "";
  const equipmentRaw = settings["equipment.items"]?.value ?? defaultSiteSettings["equipment.items"] ?? "";
  const partnersRaw = settings["partners.images"]?.value ?? defaultSiteSettings["partners.images"] ?? "";

  useEffect(() => setServices(parseItems(settings, "services.items", fallbackServices)), [servicesRaw]);
  useEffect(() => setEquipment(parseItems(settings, "equipment.items", fallbackEquipment)), [equipmentRaw]);
  useEffect(() => setPartners(settingLines(settings, "partners.images")), [partnersRaw]);

  const saveCollection = async (key: string, value: string, label: string, type: "text" | "json") => {
    setSavingKey(key);
    setMessage("");
    try {
      await saveSettingsBulk(token, [{ key, value, type, valueEn: null }]);
      setMessage(`Đã lưu ${label}.`);
      onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Không thể lưu ${label}.`);
    } finally {
      setSavingKey("");
    }
  };

  const updateService = (index: number, patch: Partial<Service>) => {
    setServices((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updateEquipment = (index: number, patch: Partial<Equipment>) => {
    setEquipment((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="mt-5 space-y-5">
      {message && <div className="border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}

      <ManagerShell
        title="Dịch vụ / Lĩnh vực"
        description="Nội dung các thẻ dịch vụ xuất hiện trên trang chủ."
        count={services.length}
        actions={writable && (
          <>
            <button
              type="button"
              onClick={() => setServices((current) => [...current, { id: String(Date.now()), name: "Dịch vụ mới", nameEn: "New service", image: "", description: "", descriptionEn: "" }])}
              className="inline-flex h-9 items-center gap-1 border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Plus size={14} />
              Thêm
            </button>
            <button
              type="button"
              disabled={savingKey === "services.items"}
              onClick={() => void saveCollection("services.items", JSON.stringify(services, null, 2), "danh sách dịch vụ", "json")}
              className="inline-flex h-9 items-center gap-1 bg-orange-500 px-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <Save size={14} />
              Lưu
            </button>
          </>
        )}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {services.map((item, index) => (
            <details key={item.id} className="group border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                <img src={item.image} alt="" className="h-16 w-24 shrink-0 bg-slate-50 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-slate-900">{item.name || "Chưa nhập tên"}</div>
                  <div className="truncate text-xs text-slate-500">{item.nameEn || "Chưa nhập tên tiếng Anh"}</div>
                </div>
              </summary>
              {writable && (
                <div className="space-y-3 border-t border-slate-100 p-4">
                  <div className="flex justify-end">
                    <EditorActions
                      index={index}
                      count={services.length}
                      onMove={(direction) => setServices((current) => moveItem(current, index, direction))}
                      onDelete={() => {
                        if (window.confirm("Xóa dịch vụ này?")) setServices((current) => current.filter((_, itemIndex) => itemIndex !== index));
                      }}
                    />
                  </div>
                  <ImageUploadField label="Ảnh dịch vụ" value={item.image} onChange={(image) => updateService(index, { image })} folder="services" token={token} />
                  <label className="block">
                    <FieldLabel>Tên dịch vụ</FieldLabel>
                    <input value={item.name} onChange={(event) => updateService(index, { name: event.target.value })} className={inputClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Tên dịch vụ tiếng Anh</FieldLabel>
                    <input value={item.nameEn} onChange={(event) => updateService(index, { nameEn: event.target.value })} className={inputClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Mô tả</FieldLabel>
                    <textarea rows={3} value={item.description} onChange={(event) => updateService(index, { description: event.target.value })} className={textAreaClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Mô tả tiếng Anh</FieldLabel>
                    <textarea rows={3} value={item.descriptionEn} onChange={(event) => updateService(index, { descriptionEn: event.target.value })} className={textAreaClassName} />
                  </label>
                </div>
              )}
            </details>
          ))}
        </div>
      </ManagerShell>

      <ManagerShell
        title="Thiết bị thi công"
        description="Danh sách thiết bị hiển thị tại trang chủ và trang thiết bị."
        count={equipment.length}
        actions={writable && (
          <>
            <button
              type="button"
              onClick={() => setEquipment((current) => [...current, { id: String(Date.now()), name: "Thiết bị mới", nameEn: "New equipment", image: "", description: "", descriptionEn: "", specs: [], specsEn: [] }])}
              className="inline-flex h-9 items-center gap-1 border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Plus size={14} />
              Thêm
            </button>
            <button
              type="button"
              disabled={savingKey === "equipment.items"}
              onClick={() => void saveCollection("equipment.items", JSON.stringify(equipment, null, 2), "danh sách thiết bị", "json")}
              className="inline-flex h-9 items-center gap-1 bg-orange-500 px-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <Save size={14} />
              Lưu
            </button>
          </>
        )}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {equipment.map((item, index) => (
            <details key={item.id} className="border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                <img src={item.image} alt="" className="h-16 w-24 shrink-0 bg-slate-50 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-slate-900">{item.name || "Chưa nhập tên"}</div>
                  <div className="truncate text-xs text-slate-500">{item.nameEn || "Chưa nhập tên tiếng Anh"}</div>
                </div>
              </summary>
              {writable && (
                <div className="space-y-3 border-t border-slate-100 p-4">
                  <div className="flex justify-end">
                    <EditorActions
                      index={index}
                      count={equipment.length}
                      onMove={(direction) => setEquipment((current) => moveItem(current, index, direction))}
                      onDelete={() => {
                        if (window.confirm("Xóa thiết bị này?")) setEquipment((current) => current.filter((_, itemIndex) => itemIndex !== index));
                      }}
                    />
                  </div>
                  <ImageUploadField label="Ảnh thiết bị" value={item.image} onChange={(image) => updateEquipment(index, { image })} folder="equipment" token={token} />
                  <label className="block">
                    <FieldLabel>Tên thiết bị</FieldLabel>
                    <input value={item.name} onChange={(event) => updateEquipment(index, { name: event.target.value })} className={inputClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Tên thiết bị tiếng Anh</FieldLabel>
                    <input value={item.nameEn} onChange={(event) => updateEquipment(index, { nameEn: event.target.value })} className={inputClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Mô tả</FieldLabel>
                    <textarea rows={3} value={item.description} onChange={(event) => updateEquipment(index, { description: event.target.value })} className={textAreaClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Mô tả tiếng Anh</FieldLabel>
                    <textarea rows={3} value={item.descriptionEn} onChange={(event) => updateEquipment(index, { descriptionEn: event.target.value })} className={textAreaClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Thông số kỹ thuật, mỗi dòng một mục</FieldLabel>
                    <textarea rows={3} value={item.specs.join("\n")} onChange={(event) => updateEquipment(index, { specs: event.target.value.split("\n").filter(Boolean) })} className={textAreaClassName} />
                  </label>
                  <label className="block">
                    <FieldLabel>Thông số tiếng Anh, mỗi dòng một mục</FieldLabel>
                    <textarea rows={3} value={item.specsEn.join("\n")} onChange={(event) => updateEquipment(index, { specsEn: event.target.value.split("\n").filter(Boolean) })} className={textAreaClassName} />
                  </label>
                </div>
              )}
            </details>
          ))}
        </div>
      </ManagerShell>

      <ManagerShell
        title="Logo đối tác và khách hàng"
        description="Các logo hiển thị dạng trình chiếu trên trang chủ."
        count={partners.length}
        actions={writable && (
          <button
            type="button"
            disabled={savingKey === "partners.images"}
            onClick={() => void saveCollection("partners.images", partners.join("\n"), "logo đối tác", "text")}
            className="inline-flex h-9 items-center gap-1 bg-orange-500 px-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60"
          >
            <Save size={14} />
            Lưu
          </button>
        )}
      >
        {writable && (
          <div className="mb-5">
            <ImageUploadField
              label="Thêm logo"
              value=""
              onChange={(url) => { if (url) setPartners((current) => [...current, url]); }}
              folder="partners"
              token={token}
            />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((src, index) => (
            <div key={`${src}-${index}`} className="border border-slate-200 bg-white p-3">
              <div className="flex h-28 items-center justify-center bg-slate-50 p-2">
                <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              {writable && (
                <div className="mt-3 flex justify-end">
                  <EditorActions
                    index={index}
                    count={partners.length}
                    onMove={(direction) => setPartners((current) => moveItem(current, index, direction))}
                    onDelete={() => {
                      if (window.confirm("Xóa logo này?")) setPartners((current) => current.filter((_, itemIndex) => itemIndex !== index));
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ManagerShell>
    </div>
  );
}
