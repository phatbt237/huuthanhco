"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from "@tiptap/react";
import { Extension, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown, Code2, Highlighter, ImageIcon,
  Italic, Link2, List, ListOrdered, Loader2, Minus, Monitor, Quote, Redo2, Smartphone, Strikethrough,
  Table2, Trash2, Underline as UnderlineIcon, Undo2, Video, X,
} from "lucide-react";
import { normalizeVimeo, uploadMedia } from "@/lib/siteApi";
import NewsRichContent from "@/components/news/NewsRichContent";

const MAX_CONTENT_LENGTH = 1_000_000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const SafePaste = Extension.create({
  name: "safePaste",
  addProseMirrorPlugins() { return []; },
  transformPastedHTML(html) {
    return html
      .replace(/<(script|iframe|object|embed|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript\s*:/gi, "");
  },
});

function VimeoNodeView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const { videoId, hash, caption } = node.attrs as { videoId: string; hash?: string; caption?: string };
  const playerUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
  if (hash) playerUrl.searchParams.set("h", hash);
  return (
    <NodeViewWrapper className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-3" contentEditable={false}>
      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950">
        <iframe src={playerUrl.toString()} title={caption || "Vimeo video"} className="h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={caption ?? ""} onChange={(event) => updateAttributes({ caption: event.target.value })} placeholder="Chú thích video" className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-red-400" />
        <button type="button" onClick={deleteNode} className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Xóa video"><Trash2 size={16} /></button>
      </div>
    </NodeViewWrapper>
  );
}

const Vimeo = Node.create({
  name: "vimeo",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      videoId: { default: "", parseHTML: (element) => element.getAttribute("data-video-id") },
      hash: { default: "", parseHTML: (element) => element.getAttribute("data-video-hash") ?? "" },
      caption: { default: "", parseHTML: (element) => element.querySelector("figcaption")?.textContent ?? "" },
    };
  },
  parseHTML() { return [{ tag: 'figure[data-provider="vimeo"]' }]; },
  renderHTML({ HTMLAttributes }) {
    const { videoId, hash, caption } = HTMLAttributes;
    const attrs: Record<string, string> = { class: "news-video news-video--vimeo", "data-provider": "vimeo", "data-video-id": String(videoId) };
    if (hash) attrs["data-video-hash"] = String(hash);
    return ["figure", attrs, ["figcaption", {}, String(caption ?? "")]];
  },
  addNodeView() { return ReactNodeViewRenderer(VimeoNodeView); },
});

type ModalKind = "link" | "image" | "vimeo" | null;

function ToolButton({ active = false, label, onClick, children, disabled = false }: { active?: boolean; label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled} className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 transition ${active ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-100"} disabled:cursor-not-allowed disabled:opacity-40`}>{children}</button>;
}

export default function NewsRichTextEditor({ value, onChange, token, language, onBusyChange }: { value: string; onChange: (html: string) => void; token: string; language: "vi" | "en"; onBusyChange?: (busy: boolean) => void }) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const extensions = useMemo(() => [
    StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] }, link: { openOnClick: false, autolink: true }, underline: {} }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Image.configure({ allowBase64: false }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
    Highlight.configure({ multicolor: true }), TextStyle, Color, CharacterCount.configure({ limit: MAX_CONTENT_LENGTH }), SafePaste, Vimeo,
  ], []);

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap min-h-[420px] px-5 py-4 outline-none" } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);
  useEffect(() => { onBusyChange?.(isBusy); }, [isBusy, onBusyChange]);

  const openModal = (kind: Exclude<ModalKind, null>) => {
    setError(""); setFile(null); setUrl(""); setAlt(""); setCaption("");
    if (kind === "link" && editor?.isActive("link")) setUrl(String(editor.getAttributes("link").href ?? ""));
    if (kind === "image" && editor?.isActive("image")) {
      const attrs = editor.getAttributes("image"); setUrl(String(attrs.src ?? "")); setAlt(String(attrs.alt ?? "")); setCaption(String(attrs.title ?? ""));
    }
    setModal(kind);
  };

  const submitModal = async () => {
    if (!editor || !modal) return;
    setError("");
    try {
      if (modal === "link") {
        if (!url.trim()) editor.chain().focus().unsetLink().run();
        else {
          const parsed = new URL(url.trim(), window.location.origin);
          if (!["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) throw new Error("Liên kết phải dùng HTTP/HTTPS, email hoặc số điện thoại.");
          editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim(), target: "_blank" }).run();
        }
      }
      if (modal === "image") {
        let src = url.trim();
        if (file) {
          if (!IMAGE_TYPES.has(file.type)) throw new Error("Chỉ hỗ trợ PNG, JPG, WEBP hoặc GIF.");
          if (file.size > MAX_IMAGE_SIZE) throw new Error("Ảnh không được vượt quá 5 MB.");
          setIsBusy(true);
          const uploaded = await uploadMedia(token, file, "news/inline", alt, language === "en" ? alt : "");
          src = uploaded.fileUrl;
        }
        if (!/^https?:\/\//i.test(src)) throw new Error("Hãy chọn ảnh hoặc nhập URL ảnh HTTP/HTTPS.");
        if (editor.isActive("image")) editor.chain().focus().updateAttributes("image", { src, alt, title: caption }).run();
        else editor.chain().focus().setImage({ src, alt, title: caption }).run();
      }
      if (modal === "vimeo") {
        if (!url.trim()) throw new Error("Hãy nhập URL Vimeo.");
        setIsBusy(true);
        const video = await normalizeVimeo(token, url.trim());
        editor.chain().focus().insertContent({ type: "vimeo", attrs: { videoId: video.videoId, hash: video.hash ?? "", caption } }).run();
      }
      setModal(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể chèn nội dung.");
    } finally { setIsBusy(false); }
  };

  if (!editor) return <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-400"><Loader2 className="mr-2 animate-spin" size={18} />Đang tải trình soạn thảo…</div>;
  const characterCount = editor.storage.characterCount.characters();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolButton label="Hoàn tác" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={15} /></ToolButton>
        <ToolButton label="Làm lại" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={15} /></ToolButton>
        <span className="mx-1 h-6 w-px bg-slate-200" />
        <label className="relative">
          <select value={editor.isActive("heading") ? String(editor.getAttributes("heading").level) : "p"} onChange={(e) => e.target.value === "p" ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: Number(e.target.value) as 1|2|3|4|5|6 }).run()} className="h-8 appearance-none rounded-md border border-slate-200 bg-white pl-2 pr-7 text-xs font-bold text-slate-600 outline-none">
            <option value="p">Đoạn văn</option>{[1,2,3,4,5,6].map((level) => <option key={level} value={level}>Tiêu đề H{level}</option>)}
          </select><ChevronDown size={13} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
        </label>
        <ToolButton label="Đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolButton>
        <ToolButton label="Nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolButton>
        <ToolButton label="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></ToolButton>
        <ToolButton label="Gạch ngang" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></ToolButton>
        <label title="Màu chữ" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-slate-100"><span className="font-black" style={{ color: editor.getAttributes("textStyle").color || "#334155" }}>A</span><input type="color" className="sr-only" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} /></label>
        <label title="Màu nền" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-slate-100"><Highlighter size={15} /><input type="color" className="sr-only" onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} /></label>
        <span className="mx-1 h-6 w-px bg-slate-200" />
        {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight], ["justify", AlignJustify]] as const).map(([alignment, Icon]) => <ToolButton key={alignment} label={`Căn ${alignment}`} active={editor.isActive({ textAlign: alignment })} onClick={() => editor.chain().focus().setTextAlign(alignment).run()}><Icon size={15} /></ToolButton>)}
        <ToolButton label="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolButton>
        <ToolButton label="Danh sách số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolButton>
        <ToolButton label="Trích dẫn" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolButton>
        <ToolButton label="Khối mã" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={15} /></ToolButton>
        <ToolButton label="Liên kết" active={editor.isActive("link")} onClick={() => openModal("link")}><Link2 size={15} /></ToolButton>
        <ToolButton label="Ảnh" active={editor.isActive("image")} onClick={() => openModal("image")}><ImageIcon size={15} /></ToolButton>
        {editor.isActive("image") && <ToolButton label="Xóa ảnh" onClick={() => editor.chain().focus().deleteSelection().run()}><Trash2 size={15} /></ToolButton>}
        <ToolButton label="Chèn bảng" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 size={15} /></ToolButton>
        {editor.isActive("table") && <><ToolButton label="Thêm hàng" onClick={() => editor.chain().focus().addRowAfter().run()}>+R</ToolButton><ToolButton label="Thêm cột" onClick={() => editor.chain().focus().addColumnAfter().run()}>+C</ToolButton><ToolButton label="Xóa bảng" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 size={15} /></ToolButton></>}
        <ToolButton label="Vimeo" onClick={() => openModal("vimeo")}><Video size={15} /></ToolButton>
        <div className="ml-auto flex items-center gap-1"><ToolButton label={preview ? "Soạn thảo" : "Xem trước"} active={preview} onClick={() => setPreview(!preview)}><Monitor size={15} /></ToolButton>{preview && <><ToolButton label="Desktop" active={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")}><Monitor size={15} /></ToolButton><ToolButton label="Mobile" active={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")}><Smartphone size={15} /></ToolButton></>}</div>
      </div>

      {preview ? <div className="bg-slate-100 p-5"><div className={`mx-auto min-h-[420px] bg-white p-6 shadow-sm transition-all ${previewMode === "mobile" ? "max-w-[390px]" : "max-w-4xl"}`}><NewsRichContent content={editor.getHTML()} /></div></div> : <EditorContent editor={editor} />}
      <div className={`border-t px-4 py-2 text-right text-xs font-semibold ${characterCount >= MAX_CONTENT_LENGTH ? "text-red-600" : "text-slate-400"}`}>{characterCount.toLocaleString("vi-VN")} / {MAX_CONTENT_LENGTH.toLocaleString("vi-VN")} ký tự</div>

      {modal && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={(e) => e.target === e.currentTarget && !isBusy && setModal(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-black text-slate-900">{modal === "link" ? "Chèn liên kết" : modal === "image" ? "Chèn / chỉnh sửa ảnh" : "Chèn video Vimeo"}</h3><button type="button" onClick={() => setModal(null)} disabled={isBusy} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>
        <div className="space-y-4">
          {modal === "image" && <><label className="block text-sm font-bold text-slate-700">Tải ảnh lên R2<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-lg border border-slate-200 p-2 text-sm" /></label><div className="flex items-center gap-3 text-xs font-bold uppercase text-slate-400"><Minus className="flex-1" /><span>hoặc URL</span><Minus className="flex-1" /></div></>}
          <label className="block text-sm font-bold text-slate-700">{modal === "vimeo" ? "URL Vimeo" : modal === "image" ? "URL ảnh" : "URL liên kết"}<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={modal === "vimeo" ? "https://vimeo.com/123456789" : "https://..."} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400" /></label>
          {modal === "image" && <label className="block text-sm font-bold text-slate-700">Văn bản thay thế (alt)<input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400" /></label>}
          {(modal === "image" || modal === "vimeo") && <label className="block text-sm font-bold text-slate-700">Chú thích<input value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400" /></label>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} disabled={isBusy} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-600">Hủy</button><button type="button" onClick={() => void submitModal()} disabled={isBusy} className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-black text-white disabled:opacity-60">{isBusy && <Loader2 className="animate-spin" size={16} />}Chèn nội dung</button></div>
      </div></div>}
    </div>
  );
}
