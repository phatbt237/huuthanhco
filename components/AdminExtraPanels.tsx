"use client";

import AccountsPanel from "@/components/admin/AccountsPanel";
import ApplicationsPanel from "@/components/admin/ApplicationsPanel";
import ContactsPanel from "@/components/admin/ContactsPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import type { AdminRole } from "@/lib/siteApi";

export type ExtraAdminTab = "accounts" | "contacts" | "applications" | "settings";

export default function AdminExtraPanels({
  tab,
  token,
  currentUserId,
  role,
}: {
  tab: ExtraAdminTab;
  token: string;
  currentUserId: string;
  role: AdminRole;
}) {
  if (tab === "accounts") return <AccountsPanel token={token} currentUserId={currentUserId} role={role} />;
  if (tab === "contacts") return <ContactsPanel token={token} role={role} />;
  if (tab === "applications") return <ApplicationsPanel token={token} role={role} />;
  return <SettingsPanel token={token} role={role} />;
}
