"use client";

import type { ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Eye, RefreshCw, Trash2 } from "lucide-react";
import type { AdminRole } from "@/lib/siteApi";

export const applicationStatusOptions = [
  { value: "new", label: "Chưa xem" },
  { value: "reviewing", label: "Đã xem" },
  { value: "interviewed", label: "Đã phỏng vấn" },
  { value: "hired", label: "Đã tuyển" },
  { value: "rejected", label: "Từ chối" },
];

export function NoPermission() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <p className="text-base font-black text-slate-900">Không có quyền truy cập</p>
      <p className="text-sm text-slate-500">Bạn không có quyền sử dụng chức năng này.</p>
    </div>
  );
}

export function PanelFrame({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
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

export function AdminListShell({
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
  children: ReactNode;
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

export function AdminDetailCard({
  eyebrow,
  title,
  status,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  status: ReactNode;
  onBack: () => void;
  children: ReactNode;
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

export function RowActions({ onView, onDelete }: { onView: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onView}
        className="inline-flex h-9 items-center gap-1.5 border border-blue-100 bg-blue-50 px-3 text-sm font-black text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
      >
        <Eye size={15} />
        Xem
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="inline-flex h-9 items-center gap-1.5 border border-red-100 bg-red-50 px-3 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100"
        >
          <Trash2 size={15} />
          Xóa
        </button>
      )}
    </div>
  );
}

export function MessageBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">{label}</div>
      <div className="min-h-32 whitespace-pre-line border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">{value}</div>
    </div>
  );
}

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-3 text-sm font-black text-slate-700">
      <RefreshCw size={15} />
      Tải lại
    </button>
  );
}

export function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-orange-400" />
    </label>
  );
}

export function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <textarea value={value} rows={5} onChange={(event) => onChange(event.target.value)} className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400" />
    </label>
  );
}

type StatusOption = string | { value: string; label: string };

export function SelectStatus({ value, options, onChange }: { value: string; options: StatusOption[]; onChange: (value: string) => void }) {
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

export function formatAdminRole(role: AdminRole) {
  const labels: Record<AdminRole, string> = {
    super_admin: "Chức năng cao nhất",
    editor: "Editor",
    hr: "HR",
    viewer: "Viewer",
  };
  return labels[role];
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  const label = applicationStatusOptions.find((option) => option.value === status)?.label ?? status;
  const isNew = status === "new";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${isNew ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
      {label}
    </span>
  );
}

export function ContactStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { new: "Chưa xem", read: "Đã xem", done: "Đã xử lý" };
  const className =
    status === "new"
      ? "bg-red-50 text-red-700"
      : status === "done"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${className}`}>{labels[status] ?? status}</span>;
}

export function DetailItem({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
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

export function DeleteButton({ onClick }: { onClick: () => void }) {
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

export function Notice({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" }) {
  return (
    <div className={`my-4 border p-3 text-sm font-bold ${tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
      {children}
    </div>
  );
}
