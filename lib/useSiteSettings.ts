"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, getSettingsMap, type SettingsMap } from "@/lib/siteApi";

export function useSiteSettings(prefix?: string) {
  const [settings, setSettings] = useState<SettingsMap>(defaultSiteSettings);
  useEffect(() => {
    void getSettingsMap(prefix).then(setSettings).catch(() => setSettings(defaultSiteSettings));
  }, [prefix]);
  return settings;
}
