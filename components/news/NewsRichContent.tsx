"use client";

import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { mediaFileUrl } from "@/lib/siteApi";

const VIDEO_ID_PATTERN = /^\d{6,12}$/;
const VIDEO_HASH_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

function textFromNode(node: DOMNode | { type: string; data?: string; children?: unknown[] }): string {
  if (node.type === "text") return node.data ?? "";
  if ("children" in node && Array.isArray(node.children)) return node.children.map((child) => textFromNode(child as DOMNode)).join("");
  return "";
}

function VimeoPlayer({ videoId, hash, title }: { videoId: string; hash?: string; title: string }) {
  const playerUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
  if (hash) playerUrl.searchParams.set("h", hash);

  return (
    <figure className="news-video news-video--vimeo">
      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950">
        <iframe
          src={playerUrl.toString()}
          title={title || "Vimeo video"}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      {title && <figcaption>{title}</figcaption>}
    </figure>
  );
}

function legacyParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>);
}

export default function NewsRichContent({ content, className = "" }: { content: string; className?: string }) {
  const normalized = content.trim();
  const isHtml = /<([a-z][\w-]*)\b[^>]*>/i.test(normalized);

  return (
    <div className={`news-rich-content ${className}`.trim()}>
      {!isHtml
        ? legacyParagraphs(normalized)
        : parse(normalized, {
            replace(domNode) {
              if (!(domNode instanceof Element)) return;
              const tagName = domNode.name.toLowerCase();
              if (["script", "iframe", "object", "embed", "style"].includes(tagName)) return <></>;

              if (tagName === "figure" && domNode.attribs["data-provider"] === "vimeo") {
                const videoId = domNode.attribs["data-video-id"] ?? "";
                const hash = domNode.attribs["data-video-hash"] ?? "";
                if (!VIDEO_ID_PATTERN.test(videoId) || (hash && !VIDEO_HASH_PATTERN.test(hash))) return <></>;
                const captionNode = domNode.children.find(
                  (child) => child instanceof Element && child.name.toLowerCase() === "figcaption",
                );
                return <VimeoPlayer videoId={videoId} hash={hash || undefined} title={captionNode ? textFromNode(captionNode as DOMNode) : "Vimeo video"} />;
              }

              if (tagName === "img") {
                const src = domNode.attribs.src ?? "";
                if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) return <></>;
                const alt = domNode.attribs.alt ?? "";
                const caption = domNode.attribs.title ?? "";
                return (
                  <figure className="news-image">
                    <img src={mediaFileUrl(src)} alt={alt} loading="lazy" />
                    {caption && <figcaption>{caption}</figcaption>}
                  </figure>
                );
              }

              if (tagName === "a") {
                const href = domNode.attribs.href ?? "";
                if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href)) return <>{domToReact(domNode.children as DOMNode[])}</>;
              }
            },
          })}
    </div>
  );
}
