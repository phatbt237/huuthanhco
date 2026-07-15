"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { mediaFileUrl, uploadMedia, type MediaRecord } from "@/lib/siteApi";

function getMediaLabel(media: MediaRecord[], src: string) {
  return media.find((item) => item.fileUrl === src)?.fileName ?? src.split("/").pop() ?? "Ảnh dự án";
}

function isImageMedia(item: MediaRecord) {
  return item.fileType === "image" || /\.(png|jpe?g|webp|gif|avif)$/i.test(item.fileUrl);
}

export default function GalleryWithThumbnail({
  label = "Ảnh",
  images,
  thumbnail,
  media,
  token,
  folder,
  onImagesChange,
  onThumbnailChange,
  onUploaded,
  onUploadingChange,
}: {
  label?: string;
  images: string[];
  thumbnail: string;
  media: MediaRecord[];
  token: string;
  folder: string;
  onImagesChange: (images: string[]) => void;
  onThumbnailChange: (thumbnail: string) => void;
  onUploaded: (item: MediaRecord) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageMedia = media.filter((item) => isImageMedia(item));
  const validImages = Array.from(new Set(images.filter(Boolean)));
  const isExplicit = !!thumbnail && validImages.includes(thumbnail);
  const effectiveThumb = isExplicit ? thumbnail : validImages[0] ?? "";

  const triggerPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    setIsUploading(true);
    onUploadingChange?.(true);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const item = await uploadMedia(token, file, folder, file.name.replace(/\.[^.]+$/, ""));
        added.push(item.fileUrl);
        onUploaded(item);
      }
      onImagesChange([...validImages, ...added]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Không upload được ảnh.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  const removeImage = (src: string) => {
    onImagesChange(validImages.filter((url) => url !== src));
    if (thumbnail === src) onThumbnailChange("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Nhấn vào khung để chọn ảnh. Nhấn <Star size={11} className="inline-block align-middle" /> để đặt ảnh đại diện - mặc định lấy ảnh đầu tiên.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(event) => void uploadFiles(event.target.files)}
      />

      {validImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {validImages.map((src, index) => {
            const isThumb = src === effectiveThumb;
            const isAutoThumb = isThumb && !isExplicit;
            return (
              <div
                key={src}
                className={`group relative overflow-hidden rounded-xl border-2 bg-white transition-all ${isThumb ? "border-orange-400 shadow-md" : "border-slate-200"}`}
              >
                <img
                  src={mediaFileUrl(src)}
                  alt={getMediaLabel(imageMedia, src)}
                  className="h-32 w-full cursor-zoom-in object-cover"
                  onClick={() => setLightboxIndex(index)}
                />
                <button
                  type="button"
                  onClick={() => onThumbnailChange(src === thumbnail ? "" : src)}
                  title={src === thumbnail ? "Bỏ chọn đại diện" : "Đặt làm ảnh đại diện"}
                  className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg shadow-sm transition-all ${
                    isThumb && !isAutoThumb
                      ? "bg-orange-500 text-white"
                      : "bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-orange-100 hover:text-orange-500"
                  }`}
                >
                  <Star size={13} fill={isThumb && !isAutoThumb ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(src)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                  aria-label="Xóa ảnh"
                >
                  <Trash2 size={13} />
                </button>
                {isThumb ? (
                  <div className="bg-orange-500 px-2 py-1 text-center text-[10px] font-black uppercase tracking-widest text-white">
                    {isAutoThumb ? "Đại diện (tự động)" : "Đại diện"}
                  </div>
                ) : (
                  <div className="truncate px-2 py-1.5 text-xs font-semibold text-slate-500">{getMediaLabel(imageMedia, src)}</div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={triggerPicker}
            disabled={isUploading}
            className="flex min-h-[9.5rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={22} /> : <Plus size={22} />}
            <span className="text-xs font-semibold">{isUploading ? "Đang tải..." : "Thêm ảnh"}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white py-12 text-slate-400 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin" size={28} /> : <Upload size={28} />}
          <div className="text-center">
            <p className="text-sm font-bold">{isUploading ? "Đang tải ảnh lên..." : "Nhấn để chọn ảnh"}</p>
            {!isUploading && <p className="mt-0.5 text-xs">Có thể chọn nhiều ảnh cùng lúc</p>}
          </div>
        </button>
      )}

      {uploadError && <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setLightboxIndex(null)}>
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((index) => index !== null ? (index - 1 + validImages.length) % validImages.length : null);
              }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <img
            src={mediaFileUrl(validImages[lightboxIndex])}
            alt={getMediaLabel(imageMedia, validImages[lightboxIndex])}
            className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((index) => index !== null ? (index + 1) % validImages.length : null);
              }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronRight size={22} />
            </button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white/80">
            {lightboxIndex + 1} / {validImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
