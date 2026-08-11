import type { AdminRole } from "@/lib/siteApi";

type Tab =
  | "news" | "projects" | "jobs" | "contacts" | "applications" | "accounts" | "settings"
  | "employees" | "equipment" | "attendance";

const ACCESS: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts", "settings", "employees", "equipment", "attendance"],
  editor:      ["news", "projects", "settings"],
  hr:          ["jobs", "contacts", "applications", "employees", "equipment", "attendance"],
  viewer:      ["contacts", "applications"],
};

const WRITE: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts", "settings", "employees", "equipment", "attendance"],
  editor:      ["news", "projects", "settings"],
  hr:          ["jobs", "contacts", "applications", "employees", "equipment", "attendance"],
  viewer:      [],
};

const DELETE_PERM: Record<AdminRole, Tab[]> = {
  super_admin: ["news", "projects", "jobs", "contacts", "applications", "accounts", "employees", "equipment", "attendance"],
  editor:      ["news", "projects"],
  hr:          ["jobs", "employees", "equipment", "attendance"],
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
