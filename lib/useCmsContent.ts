"use client";

import { useEffect, useState } from "react";
import { emptyContent, fetchCmsContent, hasCmsContent, loadCmsContent, type CmsContent } from "@/lib/cmsContent";

export function useCmsContent(initialContent?: CmsContent, enabled = true) {
  const [content, setContent] = useState<CmsContent>(initialContent ?? emptyContent);

  useEffect(() => {
    if (!enabled) return;

    if (initialContent) {
      setContent(initialContent);
      return;
    }

    let cancelled = false;
    const baseContent = emptyContent;

    const refresh = () => {
      const localContent = loadCmsContent();
      if (!hasCmsContent(baseContent) && hasCmsContent(localContent)) {
        setContent(localContent);
      }

      void fetchCmsContent().then((nextContent) => {
        if (cancelled) return;
        if (hasCmsContent(nextContent) || !hasCmsContent(baseContent)) {
          setContent(nextContent);
        }
      });
    };

    setContent(baseContent);
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("huu-thanh-cms-content-updated", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", refresh);
      window.removeEventListener("huu-thanh-cms-content-updated", refresh);
    };
  }, [enabled, initialContent]);

  return content;
}
