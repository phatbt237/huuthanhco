"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Link2, Loader2, Upload } from "lucide-react";
import type { NewsItem } from "@/data/news";
import type { MediaRecord } from "@/lib/siteApi";
import { downloadGoogleDocx, importNewsDocx } from "@/lib/newsDocumentImport";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewsDocumentImporter({
  value,
  token,
  onChange,
  onUploaded,
  onBusyChange,
}: {
  value: NewsItem;
  token: string;
  onChange: (value: NewsItem) => void;
  onUploaded: (item: MediaRecord) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [googleDocsUrl, setGoogleDocsUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const importFile = async (file: File) => {
    if ((value.title || value.content) && !window.confirm("Import tài liệu sẽ thay thế tiêu đề, mô tả, nội dung và thư viện ảnh tiếng Việt hiện tại. Tiếp tục?")) return;
    setError("");
    setWarnings([]);
    setIsImporting(true);
    onBusyChange?.(true);
    try {
      const draft = await importNewsDocx({ file, token, onProgress: setProgress });
      draft.uploaded.forEach(onUploaded);
      onChange({
        ...value,
        title: draft.title,
        slug: value.slug || slugify(draft.title),
        excerpt: draft.excerpt,
        content: draft.content,
        thumbnail: draft.thumbnail || value.thumbnail,
        galleryImages: draft.galleryImages,
        imageCaption: draft.imageCaption,
      });
      setWarnings(draft.warnings);
      setProgress(`Đã nhập ${draft.uploaded.length} ảnh và tạo bản nháp. Hãy kiểm tra trước khi lưu.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể import tài liệu.");
      setProgress("");
    } finally {
      setIsImporting(false);
      onBusyChange?.(false);
    }
  };

  const importGoogleDocs = async () => {
    if (!googleDocsUrl.trim()) {
      setError("Hãy nhập link Google Docs.");
      return;
    }
    setIsImporting(true);
    onBusyChange?.(true);
    setError("");
    setWarnings([]);
    setProgress("Đang tải tài liệu từ Google Docs…");
    try {
      const file = await downloadGoogleDocx(googleDocsUrl.trim());
      setIsImporting(false);
      onBusyChange?.(false);
      await importFile(file);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không tải được Google Docs.");
      setProgress("");
      setIsImporting(false);
      onBusyChange?.(false);
    }
  };

  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50/70 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <FileText size={18} className="text-sky-700" /> Import DOCX / Google Docs
          </div>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
            Dòng đầu in đậm hoặc Heading 1 là tiêu đề; đoạn kế tiếp là mô tả ngắn. Ảnh được tải lên R2 và giữ đúng vị trí trong nội dung.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importFile(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-black text-white transition hover:bg-sky-800 disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} Chọn file DOCX
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Link2 size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
          <input
            value={googleDocsUrl}
            onChange={(event) => setGoogleDocsUrl(event.target.value)}
            placeholder="https://docs.google.com/document/d/..."
            aria-label="Đường dẫn Google Docs"
            disabled={isImporting}
            className="h-10 w-full rounded-lg border border-sky-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-sky-500 disabled:opacity-60"
          />
        </label>
        <button
          type="button"
          onClick={() => void importGoogleDocs()}
          disabled={isImporting}
          className="h-10 rounded-lg border border-sky-300 bg-white px-4 text-sm font-black text-sky-800 transition hover:bg-sky-100 disabled:opacity-50"
        >
          Import Google Docs
        </button>
      </div>

      {progress && <p className="mt-3 flex items-start gap-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0" />{progress}</p>}
      {error && <p className="mt-3 flex items-start gap-2 text-xs font-semibold text-red-700"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</p>}
      {warnings.length > 0 && <ul className="mt-2 list-disc pl-5 text-xs font-semibold text-amber-700">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
    </section>
  );
}
