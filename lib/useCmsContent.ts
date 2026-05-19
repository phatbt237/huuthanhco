"use client";

import { useEffect, useState } from "react";
import { emptyContent, fetchCmsContent, loadCmsContent, type CmsContent } from "@/lib/cmsContent";

export function useCmsContent() {
  const [content, setContent] = useState<CmsContent>(emptyContent);

  useEffect(() => {
    const refresh = () => {
      setContent(loadCmsContent());
      void fetchCmsContent().then(setContent);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("huu-thanh-cms-content-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("huu-thanh-cms-content-updated", refresh);
    };
  }, []);

  return content;
}
