"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X, ZoomIn } from "lucide-react";
import { uploadMedia } from "@/lib/siteApi";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  token: string;
  altText?: string;
  altTextEn?: string;
}

export default function ImageUploadField({ label, value, onChange, folder, token, altText = "", altTextEn = "" }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setIsUploading(true);
    try {
      const record = await uploadMedia(token, file, folder, altText || file.name, altTextEn || file.name);
      onChange(record.fileUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</label>

      <div className="flex items-start gap-3">
        {/* Ô vuông upload */}
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-red-300 hover:bg-red-50/30"
          style={{ width: 96, height: 96, flexShrink: 0 }}
        >
          {value ? (
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-400">
              <ImageIcon size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold">Chọn ảnh</span>
            </div>
          )}

          {/* Hover overlay khi có ảnh */}
          {value && !isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 text-white opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
              <Upload size={16} />
              <span className="text-[10px] font-bold">Thay ảnh</span>
            </div>
          )}

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="animate-spin text-slate-500" size={18} />
            </div>
          )}
        </div>

        {/* Nút xem ảnh lớn (chỉ hiện khi có ảnh) */}
        {value && !isUploading && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ZoomIn size={13} />
            Xem ảnh
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
          <img
            src={value}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
