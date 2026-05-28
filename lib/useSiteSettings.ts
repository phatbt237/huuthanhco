"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, getSettingsMap, type SettingsMap } from "@/lib/siteApi";

export function useSiteSettings(prefix?: string, initialSettings?: SettingsMap) {
  const baseSettings = initialSettings ?? defaultSiteSettings;
  const [settings, setSettings] = useState<SettingsMap>(baseSettings);

  useEffect(() => {
    setSettings(baseSettings);
    void getSettingsMap(prefix).then(setSettings).catch(() => setSettings(baseSettings));
  }, [baseSettings, prefix]);

  return settings;
}
