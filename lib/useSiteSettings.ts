"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, getSettingsMap, type SettingsMap } from "@/lib/siteApi";

export function useSiteSettings(prefix?: string, initialSettings?: SettingsMap) {
  const [settings, setSettings] = useState<SettingsMap>(
    () => initialSettings ?? defaultSiteSettings,
  );

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSettings(initialSettings);
      return;
    }

    setSettings(defaultSiteSettings);
    void getSettingsMap(prefix)
      .then(setSettings)
      .catch(() => setSettings(defaultSiteSettings));
  }, [initialSettings, prefix]);

  return settings;
}
