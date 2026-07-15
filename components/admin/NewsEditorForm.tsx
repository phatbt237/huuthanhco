"use client";

import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import type { NewsItem } from "@/data/news";
import type { MediaRecord } from "@/lib/siteApi";
import { FormHeader, Input, SaveButton, Textarea } from "./AdminCmsUi";
import GalleryWithThumbnail from "./GalleryWithThumbnail";
import NewsRichTextEditor from "./NewsRichTextEditor";

type NewsEditorFormProps = {
  value: NewsItem;
  media: MediaRecord[];
  token: string;
  isSaving: boolean;
  onChange: (value: NewsItem) => void;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onUploaded: (item: MediaRecord) => void;
  onDelete?: () => void;
  onSave: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

function hasEditorContent(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0 || /<(img|figure|table)\b/i.test(html);
}

export default function NewsEditorForm({
  value,
  media,
  token,
  isSaving,
  onChange,
  onTitleChange,
  onSlugChange,
  onUploaded,
  onDelete,
  onSave,
  onDirtyChange,
}: NewsEditorFormProps) {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [inlineBusy, setInlineBusy] = useState({ vi: false, en: false, gallery: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialValue = useRef(JSON.stringify(value));
  const dirty = JSON.stringify(value) !== initialValue.current;
  const mediaBusy = inlineBusy.vi || inlineBusy.en || inlineBusy.gallery;

  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const validateAndSave = () => {
    const nextErrors: Record<string, string> = {};
    if (!value.title.trim()) nextErrors.title = "Vui lòng nhập tiêu đề tiếng Việt.";
    if (!value.slug.trim()) nextErrors.slug = "Vui lòng nhập slug.";
    if (!value.date) nextErrors.date = "Vui lòng chọn ngày đăng.";
    if (!value.category.trim()) nextErrors.category = "Vui lòng nhập danh mục.";
    if (!value.thumbnail.trim()) nextErrors.thumbnail = "Vui lòng chọn ảnh đại diện.";
    if (!hasEditorContent(value.content)) nextErrors.content = "Vui lòng nhập nội dung tiếng Việt.";
    if (value.content.length > 1_000_000 || value.contentEn.length > 1_000_000) nextErrors.content = "Nội dung không được vượt quá 1.000.000 ký tự.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSave();
  };

  return (
    <div className="space-y-5">
      <FormHeader title="Tin tức" onDelete={onDelete} />
      <div><Input label="Tiêu đề" value={value.title} onChange={onTitleChange} />{errors.title && <p className="mt-1 text-xs font-semibold text-red-600">{errors.title}</p>}</div>
      <Input label="Tiêu đề EN" value={value.titleEn} onChange={(titleEn) => onChange({ ...value, titleEn })} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div><Input label="Slug" value={value.slug} onChange={onSlugChange} />{errors.slug && <p className="mt-1 text-xs font-semibold text-red-600">{errors.slug}</p>}</div>
        <div><Input label="Ngày" type="date" value={value.date} onChange={(date) => onChange({ ...value, date })} />{errors.date && <p className="mt-1 text-xs font-semibold text-red-600">{errors.date}</p>}</div>
        <div><Input label="Danh mục" value={value.category} onChange={(category) => onChange({ ...value, category })} />{errors.category && <p className="mt-1 text-xs font-semibold text-red-600">{errors.category}</p>}</div>
        <Input label="Danh mục EN" value={value.categoryEn} onChange={(categoryEn) => onChange({ ...value, categoryEn })} />
      </div>
      <GalleryWithThumbnail
        label="Ảnh tin tức"
        images={value.galleryImages ?? []}
        thumbnail={value.thumbnail}
        media={media}
        token={token}
        folder="news"
        onImagesChange={(galleryImages) => onChange({ ...value, galleryImages })}
        onThumbnailChange={(thumbnail) => onChange({ ...value, thumbnail })}
        onUploaded={onUploaded}
        onUploadingChange={(gallery) => setInlineBusy((current) => ({ ...current, gallery }))}
      />
      {errors.thumbnail && <p className="-mt-3 text-xs font-semibold text-red-600">{errors.thumbnail}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea
          label="Chú thích ảnh (VI)"
          value={value.imageCaption ?? ""}
          onChange={(imageCaption) => onChange({ ...value, imageCaption })}
        />
        <Textarea
          label="Chú thích ảnh (EN)"
          value={value.imageCaptionEn ?? ""}
          onChange={(imageCaptionEn) => onChange({ ...value, imageCaptionEn })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea label="Mô tả ngắn (VI)" value={value.excerpt} onChange={(excerpt) => onChange({ ...value, excerpt })} />
        <Textarea label="Mô tả ngắn (EN)" value={value.excerptEn} onChange={(excerptEn) => onChange({ ...value, excerptEn })} />
      </div>
      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2 text-sm font-black text-slate-800"><Languages size={17} className="text-red-600" />Nội dung bài viết</div><p className="mt-1 text-xs font-medium text-slate-400">HTML được backend làm sạch trước khi lưu.</p></div>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button type="button" onClick={() => setLanguage("vi")} className={`rounded-md px-4 py-2 text-xs font-black ${language === "vi" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}>Tiếng Việt</button>
            <button type="button" onClick={() => setLanguage("en")} className={`rounded-md px-4 py-2 text-xs font-black ${language === "en" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}>English</button>
          </div>
        </div>
        <div className={language === "vi" ? "block" : "hidden"}>
          <NewsRichTextEditor value={value.content} onChange={(content) => onChange({ ...value, content })} token={token} language="vi" onBusyChange={(vi) => setInlineBusy((current) => ({ ...current, vi }))} />
        </div>
        <div className={language === "en" ? "block" : "hidden"}>
          <NewsRichTextEditor value={value.contentEn} onChange={(contentEn) => onChange({ ...value, contentEn })} token={token} language="en" onBusyChange={(en) => setInlineBusy((current) => ({ ...current, en }))} />
        </div>
        {errors.content && <p className="mt-2 text-xs font-semibold text-red-600">{errors.content}</p>}
      </div>
      {mediaBusy && <p className="text-sm font-semibold text-amber-700">Đang xử lý media, vui lòng đợi trước khi lưu.</p>}
      <SaveButton disabled={isSaving || mediaBusy} onClick={validateAndSave} />
    </div>
  );
}
