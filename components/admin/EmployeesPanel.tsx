"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  createEmployee,
  deleteEmployee,
  ForbiddenError,
  listEmployees,
  updateEmployee,
  type EmployeeInput,
  type EmployeeRecord,
  type EmployeeStatus,
} from "@/lib/hrApi";
import type { AdminRole } from "@/lib/siteApi";
import { Field, NoPermission, Notice, PanelFrame, TextAreaField } from "./AdminPanelUi";

const blankForm: EmployeeInput = {
  code: "",
  fullName: "",
  position: "",
  department: "",
  phone: "",
  email: "",
  idNumber: "",
  dateOfBirth: "",
  hireDate: "",
  status: "active",
  projectAssigned: "",
  notes: "",
};

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Đang làm việc",
  on_leave: "Đang nghỉ phép",
  inactive: "Đã nghỉ việc",
};

const statusClasses: Record<EmployeeStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  on_leave: "bg-amber-50 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
};

export default function EmployeesPanel({ token, role }: { token: string; role: AdminRole }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [form, setForm] = useState<EmployeeInput>(blankForm);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [forbidden, setForbidden] = useState(false);

  const refresh = () => void listEmployees(token).then(setEmployees).catch((err) => {
    if (err instanceof ForbiddenError) { setForbidden(true); return; }
    setMessage(err.message);
    setMessageTone("error");
  });

  useEffect(refresh, [token]);

  const filtered = employees.filter((employee) => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return [employee.code, employee.fullName, employee.position, employee.department, employee.phone]
      .some((value) => String(value ?? "").toLowerCase().includes(keyword));
  });

  const openCreateForm = () => {
    setMessage("");
    setEditingId(null);
    setForm(blankForm);
    setIsEditorOpen(true);
  };

  const openEditForm = (employee: EmployeeRecord) => {
    setMessage("");
    setEditingId(employee.id);
    setForm({
      code: employee.code,
      fullName: employee.fullName,
      position: employee.position,
      department: employee.department,
      phone: employee.phone,
      email: employee.email ?? "",
      idNumber: employee.idNumber ?? "",
      dateOfBirth: employee.dateOfBirth ?? "",
      hireDate: employee.hireDate ?? "",
      status: employee.status,
      projectAssigned: employee.projectAssigned ?? "",
      notes: employee.notes ?? "",
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
        await updateEmployee(token, editingId, form);
        setMessage("Đã cập nhật thông tin nhân viên.");
      } else {
        await createEmployee(token, form);
        setMessage("Đã thêm nhân viên mới.");
      }
      setMessageTone("success");
      closeForm();
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không lưu được thông tin nhân viên.");
      setMessageTone("error");
    }
  };

  const remove = (id: string) => {
    if (!window.confirm("Xóa nhân viên này?")) return;
    void deleteEmployee(token, id).then(refresh).catch((error) => {
      setMessage(error instanceof Error ? error.message : "Không xóa được nhân viên.");
      setMessageTone("error");
    });
  };

  if (forbidden) return <NoPermission />;

  return (
    <PanelFrame title="Quản lý nhân viên">
      {message && <Notice tone={messageTone}>{message}</Notice>}

      {isEditorOpen && (
        <div className="mb-5 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">{editingId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">Hồ sơ nhân sự dùng cho chấm công và phân công thiết bị.</p>
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
            <Field label="Mã nhân viên" value={form.code} onChange={(value) => setForm({ ...form, code: value })} />
            <Field label="Họ và tên" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
            <Field label="Chức vụ" value={form.position} onChange={(value) => setForm({ ...form, position: value })} />
            <Field label="Phòng ban / Đội thi công" value={form.department} onChange={(value) => setForm({ ...form, department: value })} />
            <Field label="Số điện thoại" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
            <Field label="Email" type="email" value={form.email ?? ""} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="Số CCCD/CMND" value={form.idNumber ?? ""} onChange={(value) => setForm({ ...form, idNumber: value })} />
            <Field label="Ngày sinh" type="date" value={form.dateOfBirth ?? ""} onChange={(value) => setForm({ ...form, dateOfBirth: value })} />
            <Field label="Ngày vào làm" type="date" value={form.hireDate ?? ""} onChange={(value) => setForm({ ...form, hireDate: value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as EmployeeStatus })}
                className="h-11 w-full border border-slate-200 px-3 text-sm"
              >
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <Field label="Công trình đang phân công" value={form.projectAssigned ?? ""} onChange={(value) => setForm({ ...form, projectAssigned: value })} />
          </div>
          <div className="mt-3">
            <TextAreaField label="Ghi chú" value={form.notes ?? ""} onChange={(value) => setForm({ ...form, notes: value })} />
          </div>

          <button onClick={submit} className="mt-4 inline-flex h-11 items-center gap-2 bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700">
            <Plus size={16} />
            {editingId ? "Lưu thay đổi" : "Thêm nhân viên"}
          </button>
        </div>
      )}

      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Danh sách nhân viên</h3>
            <p className="mt-1 text-sm font-semibold text-slate-400">{filtered.length} nhân viên đang hiển thị</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo mã, tên, chức vụ..."
                className="h-12 w-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-orange-300 sm:w-80"
              />
            </label>
            {canWrite(role, "employees") && (
              <button onClick={openCreateForm} className="inline-flex h-12 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700">
                <Plus size={17} />
                Thêm nhân viên
              </button>
            )}
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[64rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-4 font-black">Mã NV</th>
                <th className="px-5 py-4 font-black">Họ tên</th>
                <th className="px-5 py-4 font-black">Chức vụ</th>
                <th className="px-5 py-4 font-black">Phòng ban / Đội</th>
                <th className="px-5 py-4 font-black">Số điện thoại</th>
                <th className="px-5 py-4 font-black">Trạng thái</th>
                <th className="px-5 py-4 font-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100 transition hover:bg-orange-50/40">
                  <td className="px-5 py-4 font-bold text-slate-700">{employee.code}</td>
                  <td className="px-5 py-4 font-black text-slate-950">{employee.fullName}</td>
                  <td className="px-5 py-4 text-slate-700">{employee.position || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{employee.department || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{employee.phone || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses[employee.status]}`}>
                      {statusLabels[employee.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canWrite(role, "employees") && (
                        <button onClick={() => openEditForm(employee)} className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100">
                          Sửa
                        </button>
                      )}
                      {canDelete(role, "employees") && (
                        <button onClick={() => remove(employee.id)} className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100">
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
                    Chưa có nhân viên phù hợp.
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
