import type { AdminRole } from "@/lib/siteApi";

type Tab = "news" | "projects" | "jobs" | "contacts" | "applications" | "accounts" | "settings";

const ACCESS: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts", "settings"],
  editor:      ["news", "projects", "settings"],
  hr:          ["jobs", "contacts", "applications"],
  viewer:      ["contacts", "applications"],
};

const WRITE: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts", "settings"],
  editor:      ["news", "projects", "settings"],
  hr:          ["jobs", "contacts", "applications"],
  viewer:      [],
};

const DELETE_PERM: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts"],
  editor:      ["news", "projects"],
  hr:          ["jobs"],
  viewer:      [],
};

export function canAccess(role: AdminRole, tab: Tab): boolean {
  return ACCESS[role].includes(tab);
}

export function canWrite(role: AdminRole, tab: Tab): boolean {
  return WRITE[role].includes(tab);
}

export function canDelete(role: AdminRole, tab: Tab): boolean {
  return DELETE_PERM[role].includes(tab);
}

export function defaultTab(role: AdminRole): Tab {
  if (canAccess(role, "projects")) return "projects";
  return ACCESS[role][0];
}
