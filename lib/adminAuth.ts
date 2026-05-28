const ACCESS_TOKEN_KEY = "huu-thanh-admin-access-token";
const REFRESH_TOKEN_KEY = "huu-thanh-admin-refresh-token";
const LEGACY_ADMIN_USER_KEY = "huu-thanh-admin-user";

export type AdminUser = {
  id: string;
  email: string;
  fullName?: string | null;
  role: "super_admin" | "editor" | "hr" | "viewer";
  status?: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

type StoredTokens = Pick<LoginResponse, "accessToken" | "refreshToken">;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredAdminSession() {
  if (!isBrowser()) return null;
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_ADMIN_USER_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

function isAdminUser(value: unknown): value is AdminUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AdminUser>;
  return (
    typeof user.id === "string"
    && typeof user.email === "string"
    && ["super_admin", "editor", "hr", "viewer"].includes(String(user.role))
  );
}

export async function validateAdminSession(session: StoredTokens): Promise<LoginResponse | null> {
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  }).catch(() => null);

  if (!response?.ok) return null;
  const user = await response.json().catch(() => null);
  return isAdminUser(user) ? { ...session, user } : null;
}

export function storeAdminSession(session: LoginResponse) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  window.localStorage.removeItem(LEGACY_ADMIN_USER_KEY);
}

export function clearStoredAdminSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_ADMIN_USER_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (!response?.ok) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  const session = (await response.json()) as LoginResponse;
  if (!session.accessToken || !session.refreshToken || !isAdminUser(session.user)) {
    throw new Error("Phản hồi đăng nhập không hợp lệ.");
  }
  storeAdminSession(session);
  return session;
}

export async function logoutAdmin(refreshToken?: string) {
  if (refreshToken) {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }
  clearStoredAdminSession();
}
