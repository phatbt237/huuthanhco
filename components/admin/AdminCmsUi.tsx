"use client";

import type { ReactNode } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";

export function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function SideNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-red-600 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function LoginField({
  icon,
  placeholder,
  value,
  onChange,
  type,
  autoComplete,
}: {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="relative block">
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-slate-300 bg-white pl-4 pr-12 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#3f98c4] focus:ring-2 focus:ring-[#3f98c4]/15"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
    </label>
  );
}

export function ItemThumbnail({ src, alt }: { src: string; alt: string }) {
  if (!src) return <div className="h-12 w-18 rounded-lg border border-dashed border-slate-200 bg-slate-50" />;
  return (
    <div className="h-12 w-[4.5rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img src={src} alt={alt || "Ảnh nội dung"} className="h-full w-full object-cover" />
    </div>
  );
}

export function FormHeader({ title, onDelete }: { title: string; onDelete?: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-[11px] font-black uppercase tracking-widest text-red-500">Biên tập</div>
        <h2 className="mt-0.5 text-xl font-black text-slate-900">{title}</h2>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={15} />
          Xóa
        </button>
      )}
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

export function SaveButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {disabled ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
      {disabled ? "Đang lưu…" : "Lưu nội dung"}
    </button>
  );
}
