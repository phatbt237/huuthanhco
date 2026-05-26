"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { canDelete, canWrite } from "@/lib/permissions";
import {
  createAdminUser,
  deleteAdminUser,
  ForbiddenError,
  listAdminUsers,
  updateAdminUser,
  type AdminRole,
  type AdminUserRecord,
} from "@/lib/siteApi";
import { Field, formatAdminRole, NoPermission, Notice, PanelFrame } from "./AdminPanelUi";

export default function AccountsPanel({ token, currentUserId, role }: { token: string; currentUserId: string; role: AdminRole }) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "editor" as AdminRole });
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [forbidden, setForbidden] = useState(false);

  const refresh = () => void listAdminUsers(token).then(setUsers).catch((err) => {
    if (err instanceof ForbiddenError) { setForbidden(true); return; }
    setMessage(err.message);
  });

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

  if (forbidden) return <NoPermission />;

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
            {canWrite(role, "accounts") && (
              <button
                onClick={openCreateForm}
                className="inline-flex h-12 items-center justify-center gap-2 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700"
              >
                <Plus size={17} />
                Tạo mới
              </button>
            )}
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
                      {canWrite(role, "accounts") && (
                        <button
                          onClick={() => openEditForm(user)}
                          className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                        >
                          Sửa
                        </button>
                      )}
                      {canDelete(role, "accounts") && (
                        <button
                          disabled={user.id === currentUserId}
                          onClick={() => {
                            if (window.confirm("Xóa tài khoản này?")) void deleteAdminUser(token, user.id).then(refresh);
                          }}
                          className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300"
                        >
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      )}
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
