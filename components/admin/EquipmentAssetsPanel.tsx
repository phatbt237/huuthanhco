"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  createEquipmentAsset,
  deleteEquipmentAsset,
  ForbiddenError,
  listEmployees,
  listEquipmentAssets,
  updateEquipmentAsset,
  type EmployeeRecord,
  type EquipmentAssetInput,
  type EquipmentAssetRecord,
  type EquipmentAssetStatus,
} from "@/lib/hrApi";
import type { AdminRole } from "@/lib/siteApi";
import { Field, NoPermission, Notice, PanelFrame, TextAreaField } from "./AdminPanelUi";

const blankForm: EquipmentAssetInput = {
  code: "",
  name: "",
  category: "",
  status: "available",
  location: "",
  assignedToEmployeeId: "",
  purchaseDate: "",
  lastMaintenanceDate: "",
  nextMaintenanceDate: "",
  notes: "",
};

const statusLabels: Record<EquipmentAssetStatus, string> = {
  available: "Sẵn sàng",
  in_use: "Đang sử dụng",
  maintenance: "Đang bảo trì",
  broken: "Hư hỏng",
  retired: "Đã thanh lý",
};

const statusClasses: Record<EquipmentAssetStatus, string> = {
  available: "bg-emerald-50 text-emerald-700",
  in_use: "bg-blue-50 text-blue-700",
  maintenance: "bg-amber-50 text-amber-700",
  broken: "bg-red-50 text-red-700",
  retired: "bg-slate-100 text-slate-500",
};

export default function EquipmentAssetsPanel({ token, role }: { token: string; role: AdminRole }) {
  const [assets, setAssets] = useState<EquipmentAssetRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [form, setForm] = useState<EquipmentAssetInput>(blankForm);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [forbidden, setForbidden] = useState(false);

  const refresh = () => void listEquipmentAssets(token).then(setAssets).catch((err) => {
    if (err instanceof ForbiddenError) { setForbidden(true); return; }
    setMessage(err.message);
    setMessageTone("error");
  });

  useEffect(refresh, [token]);
  useEffect(() => {
    void listEmployees(token).then(setEmployees).catch(() => setEmployees([]));
  }, [token]);

  const employeeName = (id?: string) => employees.find((employee) => employee.id === id)?.fullName ?? "";

  const filtered = assets.filter((asset) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return [asset.code, asset.name, asset.category, asset.location, employeeName(asset.assignedToEmployeeId)]
      .some((value) => String(value ?? "").toLowerCase().includes(keyword));
  });

  const openCreateForm = () => {
    setMessage("");
    setEditingId(null);
    setForm(blankForm);
    setIsEditorOpen(true);
  };

  const openEditForm = (asset: EquipmentAssetRecord) => {
    setMessage("");
    setEditingId(asset.id);
    setForm({
      code: asset.code,
      name: asset.name,
      category: asset.category,
      status: asset.status,
      location: asset.location ?? "",
      assignedToEmployeeId: asset.assignedToEmployeeId ?? "",
      purchaseDate: asset.purchaseDate ?? "",
      lastMaintenanceDate: asset.lastMaintenanceDate ?? "",
      nextMaintenanceDate: asset.nextMaintenanceDate ?? "",
      notes: asset.notes ?? "",
    });
    setIsEditorOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(blankForm);
    setIsEditorOpen(false);
  };

  const submit = async () => {
    setMessage("");
    try {
      if (editingId) {
        await updateEquipmentAsset(token, editingId, form);
        setMessage("Đã cập nhật thiết bị.");
      } else {
        await createEquipmentAsset(token, form);
        setMessage("Đã thêm thiết bị mới.");
      }
      setMessageTone("success");
      closeForm();
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không lưu được thông tin thiết bị.");
      setMessageTone("error");
    }
  };

  const remove = (id: string) => {
    if (!window.confirm("Xóa thiết bị này?")) return;
    void deleteEquipmentAsset(token, id).then(refresh).catch((error) => {
      setMessage(error instanceof Error ? error.message : "Không xóa được thiết bị.");
      setMessageTone("error");
    });
  };

  if (forbidden) return <NoPermission />;

  return (
    <PanelFrame title="Quản lý thiết bị">
      {message && <Notice tone={messageTone}>{message}</Notice>}

      {isEditorOpen && (
        <div className="mb-5 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">{editingId ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">Theo dõi tình trạng, vị trí và lịch bảo trì thiết bị công trình.</p>
            </div>
            <button
              onClick={closeForm}
              className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Mã thiết bị" value={form.code} onChange={(value) => setForm({ ...form, code: value })} />
            <Field label="Tên thiết bị" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="Loại thiết bị" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as EquipmentAssetStatus })}
                className="h-11 w-full border border-slate-200 px-3 text-sm"
              >
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <Field label="Vị trí / Công trình" value={form.location ?? ""} onChange={(value) => setForm({ ...form, location: value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Người/đội đang sử dụng</span>
              <select
                value={form.assignedToEmployeeId ?? ""}
                onChange={(event) => setForm({ ...form, assignedToEmployeeId: event.target.value })}
                className="h-11 w-full border border-slate-200 px-3 text-sm"
              >
                <option value="">Chưa phân công</option>
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
              </select>
            </label>
            <Field label="Ngày mua" type="date" value={form.purchaseDate ?? ""} onChange={(value) => setForm({ ...form, purchaseDate: value })} />
            <Field label="Bảo trì lần cuối" type="date" value={form.lastMaintenanceDate ?? ""} onChange={(value) => setForm({ ...form, lastMaintenanceDate: value })} />
            <Field label="Lịch bảo trì kế tiếp" type="date" value={form.nextMaintenanceDate ?? ""} onChange={(value) => setForm({ ...form, nextMaintenanceDate: value })} />
          </div>
          <div className="mt-3">
            <TextAreaField label="Ghi chú" value={form.notes ?? ""} onChange={(value) => setForm({ ...form, notes: value })} />
          </div>

          <button onClick={submit} className="mt-4 inline-flex h-11 items-center gap-2 bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700">
            <Plus size={16} />
            {editingId ? "Lưu thay đổi" : "Thêm thiết bị"}
          </button>
        </div>
      )}

      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Danh sách thiết bị</h3>
            <p className="mt-1 text-sm font-semibold text-slate-400">{filtered.length} thiết bị đang hiển thị</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo mã, tên, vị trí..."
                className="h-12 w-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-orange-300 sm:w-80"
              />
            </label>
            {canWrite(role, "equipment") && (
              <button onClick={openCreateForm} className="inline-flex h-12 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700">
                <Plus size={17} />
                Thêm thiết bị
              </button>
            )}
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-4 font-black">Mã TB</th>
                <th className="px-5 py-4 font-black">Tên thiết bị</th>
                <th className="px-5 py-4 font-black">Loại</th>
                <th className="px-5 py-4 font-black">Vị trí</th>
                <th className="px-5 py-4 font-black">Người sử dụng</th>
                <th className="px-5 py-4 font-black">Trạng thái</th>
                <th className="px-5 py-4 font-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-t border-slate-100 transition hover:bg-orange-50/40">
                  <td className="px-5 py-4 font-bold text-slate-700">{asset.code}</td>
                  <td className="px-5 py-4 font-black text-slate-950">{asset.name}</td>
                  <td className="px-5 py-4 text-slate-700">{asset.category || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{asset.location || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{employeeName(asset.assignedToEmployeeId) || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses[asset.status]}`}>
                      {statusLabels[asset.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canWrite(role, "equipment") && (
                        <button onClick={() => openEditForm(asset)} className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100">
                          Sửa
                        </button>
                      )}
                      {canDelete(role, "equipment") && (
                        <button onClick={() => remove(asset.id)} className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100">
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm font-semibold text-slate-400">
                    Chưa có thiết bị phù hợp.
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
