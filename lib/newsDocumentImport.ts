"use client";

import mammoth from "mammoth";
import { normalizeVimeo, uploadMedia, type MediaRecord } from "@/lib/siteApi";

const MAX_DOCX_SIZE = 20 * 1024 * 1024;
const IMAGE_DATA_URL = /^data:([^;]+);base64,(.+)$/;
const VIMEO_MARKER = /^\[VIMEO:\s*(https?:\/\/[^\]]+)\]$/i;

export type ImportedNewsDraft = {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  galleryImages: string[];
  imageCaption: string;
  warnings: string[];
  uploaded: MediaRecord[];
};

function dataUrlToFile(dataUrl: string, index: number) {
  const match = dataUrl.match(IMAGE_DATA_URL);
  if (!match) throw new Error("Ảnh trong tài liệu không hợp lệ.");
  const mimeType = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : mimeType === "image/gif" ? "gif" : "jpg";
  return new File([bytes], `news-doc-${index + 1}.${extension}`, { type: mimeType });
}

function elementText(element: Element | undefined) {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function isProbableTitle(element: Element | undefined) {
  if (!element) return false;
  const text = elementText(element);
  return /^H[1-6]$/.test(element.tagName) || (!!text && element.querySelector("strong") !== null && text.length <= 180);
}

export async function importNewsDocx({
  file,
  token,
  onProgress,
}: {
  file: File;
  token: string;
  onProgress?: (message: string) => void;
}): Promise<ImportedNewsDraft> {
  if (!/\.docx$/i.test(file.name) && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    throw new Error("Chỉ hỗ trợ tài liệu DOCX.");
  }
  if (file.size > MAX_DOCX_SIZE) throw new Error("Tài liệu DOCX không được vượt quá 20 MB.");

  onProgress?.("Đang đọc cấu trúc tài liệu…");
  const result = await mammoth.convertToHtml(
    { arrayBuffer: await file.arrayBuffer() },
    {
      convertImage: mammoth.images.imgElement(async (image) => ({
        src: `data:${image.contentType};base64,${await image.read("base64")}`,
      })),
    },
  );

  const documentNode = new DOMParser().parseFromString(`<main>${result.value}</main>`, "text/html");
  const container = documentNode.querySelector("main");
  if (!container) throw new Error("Không đọc được nội dung tài liệu.");

  const blocks = Array.from(container.children);
  const titleBlock = isProbableTitle(blocks[0]) ? blocks.shift() : undefined;
  const title = elementText(titleBlock);
  const excerptBlock = blocks.find((block) => block.tagName === "P" && !block.querySelector("img") && elementText(block));
  const excerpt = elementText(excerptBlock);
  excerptBlock?.remove();
  titleBlock?.remove();

  if (!title) throw new Error("Không tìm thấy tiêu đề. Hãy đặt tiêu đề ở dòng đầu và in đậm hoặc dùng Heading 1.");
  if (!excerpt) throw new Error("Không tìm thấy mô tả ngắn ở đoạn văn đầu tiên sau tiêu đề.");

  const warnings = result.messages.map((message) => message.message);
  const uploaded: MediaRecord[] = [];
  const images = Array.from(container.querySelectorAll("img"));
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    const dataUrl = image.getAttribute("src") ?? "";
    if (!IMAGE_DATA_URL.test(dataUrl)) continue;
    const nextSibling = image.parentElement?.nextElementSibling;
    const caption = nextSibling?.tagName === "P" && nextSibling.querySelector("em") ? elementText(nextSibling) : "";
    onProgress?.(`Đang tải ảnh ${index + 1}/${images.length} lên R2…`);
    const record = await uploadMedia(token, dataUrlToFile(dataUrl, index), "news/inline", image.getAttribute("alt") || caption || title);
    uploaded.push(record);
    image.setAttribute("src", record.fileUrl);
    image.setAttribute("alt", image.getAttribute("alt") || caption || title);
    if (caption) {
      image.setAttribute("title", caption);
      nextSibling?.remove();
    }
    const wrapper = image.parentElement;
    if (wrapper?.tagName === "P" && elementText(wrapper) === "") wrapper.replaceWith(image);
  }

  const markerParagraphs = Array.from(container.querySelectorAll("p"));
  for (const paragraph of markerParagraphs) {
    const marker = elementText(paragraph).match(VIMEO_MARKER);
    if (!marker) continue;
    try {
      onProgress?.("Đang xác thực Vimeo…");
      const video = await normalizeVimeo(token, marker[1]);
      const figure = documentNode.createElement("figure");
      figure.className = "news-video news-video--vimeo";
      figure.dataset.provider = "vimeo";
      figure.dataset.videoId = video.videoId;
      if (video.hash) figure.dataset.videoHash = video.hash;
      const caption = documentNode.createElement("figcaption");
      caption.textContent = "Video";
      figure.append(caption);
      paragraph.replaceWith(figure);
    } catch {
      warnings.push(`Không xác thực được Vimeo: ${marker[1]}`);
    }
  }

  const galleryImages = uploaded.map((item) => item.fileUrl);
  const firstImage = container.querySelector("img");
  const firstCaption = firstImage?.getAttribute("title") ?? "";
  const content = container.innerHTML.trim();
  if (!content) throw new Error("Tài liệu không có phần nội dung sau tiêu đề và mô tả ngắn.");

  onProgress?.("Đã tạo bản nháp từ tài liệu.");
  return {
    title,
    excerpt,
    content,
    thumbnail: galleryImages[0] ?? "",
    galleryImages,
    imageCaption: firstCaption,
    warnings,
    uploaded,
  };
}

export async function downloadGoogleDocx(url: string) {
  const response = await fetch("/api/news/import-google-doc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(detail?.error || "Không tải được Google Docs.");
  }
  const blob = await response.blob();
  return new File([blob], "google-doc.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
