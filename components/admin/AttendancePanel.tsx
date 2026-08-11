"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  createAttendance,
  deleteAttendance,
  ForbiddenError,
  listAttendance,
  listEmployees,
  updateAttendance,
  type AttendanceInput,
  type AttendanceRecordItem,
  type AttendanceStatus,
  type EmployeeRecord,
} from "@/lib/hrApi";
import type { AdminRole } from "@/lib/siteApi";
import { Field, NoPermission, Notice, PanelFrame, TextAreaField } from "./AdminPanelUi";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function blankFormFor(employeeId: string): AttendanceInput {
  return {
    employeeId,
    date: new Date().toISOString().slice(0, 10),
    checkIn: "",
    checkOut: "",
    status: "present",
    overtimeHours: undefined,
    note: "",
  };
}

const statusLabels: Record<AttendanceStatus, string> = {
  present: "Có mặt",
  absent: "Vắng",
  leave: "Nghỉ phép",
  late: "Đi muộn",
  half_day: "Nửa ca",
};

const statusClasses: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-700",
  leave: "bg-amber-50 text-amber-700",
  late: "bg-orange-50 text-orange-700",
  half_day: "bg-blue-50 text-blue-700",
};

export default function AttendancePanel({ token, role }: { token: string; role: AdminRole }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [records, setRecords] = useState<AttendanceRecordItem[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [form, setForm] = useState<AttendanceInput>(blankFormFor(""));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    void listEmployees(token).then(setEmployees).catch(() => setEmployees([]));
  }, [token]);

  const refresh = () => void listAttendance(token, { month, employeeId: employeeFilter || undefined })
    .then(setRecords)
    .catch((err) => {
      if (err instanceof ForbiddenError) { setForbidden(true); return; }
      setMessage(err.message);
      setMessageTone("error");
    });

  useEffect(refresh, [token, month, employeeFilter]);

  const employeeName = (id: string) => employees.find((employee) => employee.id === id)?.fullName ?? "Không rõ";

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date) || employeeName(a.employeeId).localeCompare(employeeName(b.employeeId), "vi")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, employees],
  );

  const openCreateForm = () => {
    setMessage("");
    setEditingId(null);
    setForm(blankFormFor(employeeFilter || employees[0]?.id || ""));
    setIsEditorOpen(true);
  };

  const openEditForm = (record: AttendanceRecordItem) => {
    setMessage("");
    setEditingId(record.id);
    setForm({
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn ?? "",
      checkOut: record.checkOut ?? "",
      status: record.status,
      overtimeHours: record.overtimeHours,
      note: record.note ?? "",
    });
    setIsEditorOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setIsEditorOpen(false);
  };

  const submit = async () => {
    setMessage("");
    if (!form.employeeId) {
      setMessage("Vui lòng chọn nhân viên.");
      setMessageTone("error");
      return;
    }
    try {
      if (editingId) {
        await updateAttendance(token, editingId, form);
        setMessage("Đã cập nhật bản ghi chấm công.");
      } else {
        await createAttendance(token, form);
        setMessage("Đã lưu công cho nhân viên (ghi đè nếu đã có công trong ngày).");
      }
      setMessageTone("success");
      closeForm();
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không lưu được bản ghi chấm công.");
      setMessageTone("error");
    }
  };

  const remove = (id: string) => {
    if (!window.confirm("Xóa bản ghi chấm công này?")) return;
    void deleteAttendance(token, id).then(refresh).catch((error) => {
      setMessage(error instanceof Error ? error.message : "Không xóa được bản ghi.");
      setMessageTone("error");
    });
  };

  if (forbidden) return <NoPermission />;

  return (
    <PanelFrame title="Chấm công">
      {message && <Notice tone={messageTone}>{message}</Notice>}

      {isEditorOpen && (
        <div className="mb-5 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">{editingId ? "Chỉnh sửa công" : "Chấm công"}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">Mỗi nhân viên chỉ có một bản ghi công cho mỗi ngày; lưu lại sẽ cập nhật bản ghi cũ.</p>
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
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Nhân viên</span>
              <select
                value={form.employeeId}
                onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
                disabled={Boolean(editingId)}
                className="h-11 w-full border border-slate-200 px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Chọn nhân viên</option>
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
              </select>
            </label>
            <Field label="Ngày công" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as AttendanceStatus })}
                className="h-11 w-full border border-slate-200 px-3 text-sm"
              >
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <Field label="Số giờ tăng ca" type="number" value={form.overtimeHours?.toString() ?? ""} onChange={(value) => setForm({ ...form, overtimeHours: value ? Number(value) : undefined })} />
            <Field label="Giờ vào" type="time" value={form.checkIn ?? ""} onChange={(value) => setForm({ ...form, checkIn: value })} />
            <Field label="Giờ ra" type="time" value={form.checkOut ?? ""} onChange={(value) => setForm({ ...form, checkOut: value })} />
          </div>
          <div className="mt-3">
            <TextAreaField label="Ghi chú" value={form.note ?? ""} onChange={(value) => setForm({ ...form, note: value })} />
          </div>

          <button onClick={submit} className="mt-4 inline-flex h-11 items-center gap-2 bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700">
            <Plus size={16} />
            {editingId ? "Lưu thay đổi" : "Lưu công"}
          </button>
        </div>
      )}

      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Bảng công</h3>
            <p className="mt-1 text-sm font-semibold text-slate-400">{sortedRecords.length} bản ghi trong tháng đang hiển thị</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="h-12 border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-orange-300"
            />
            <select
              value={employeeFilter}
              onChange={(event) => setEmployeeFilter(event.target.value)}
              className="h-12 border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-orange-300"
            >
              <option value="">Tất cả nhân viên</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
            </select>
            {canWrite(role, "attendance") && (
              <button onClick={openCreateForm} className="inline-flex h-12 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700">
                <Plus size={17} />
                Chấm công
              </button>
            )}
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[60rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-4 font-black">Ngày</th>
                <th className="px-5 py-4 font-black">Nhân viên</th>
                <th className="px-5 py-4 font-black">Giờ vào - ra</th>
                <th className="px-5 py-4 font-black">Tăng ca</th>
                <th className="px-5 py-4 font-black">Trạng thái</th>
                <th className="px-5 py-4 font-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-100 transition hover:bg-orange-50/40">
                  <td className="px-5 py-4 font-bold text-slate-700">{record.date}</td>
                  <td className="px-5 py-4 font-black text-slate-950">{employeeName(record.employeeId)}</td>
                  <td className="px-5 py-4 text-slate-700">{record.checkIn || "-"} — {record.checkOut || "-"}</td>
                  <td className="px-5 py-4 text-slate-700">{record.overtimeHours ? `${record.overtimeHours}h` : "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses[record.status]}`}>
                      {statusLabels[record.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canWrite(role, "attendance") && (
                        <button onClick={() => openEditForm(record)} className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100">
                          Sửa
                        </button>
                      )}
                      {canDelete(role, "attendance") && (
                        <button onClick={() => remove(record.id)} className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100">
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!sortedRecords.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-semibold text-slate-400">
                    Chưa có dữ liệu chấm công cho khoảng thời gian này.
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
