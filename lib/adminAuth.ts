const CMS_API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/$/, "") ?? "";
const ACCESS_TOKEN_KEY = "huu-thanh-admin-access-token";
const REFRESH_TOKEN_KEY = "huu-thanh-admin-refresh-token";
const ADMIN_USER_KEY = "huu-thanh-admin-user";

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

function cmsApiUrl(path: string) {
  const normalizedPath =
    CMS_API_BASE_URL.endsWith("/api") && path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;
  return `${CMS_API_BASE_URL}${normalizedPath}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredAdminSession() {
  if (!isBrowser()) return null;
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  const rawUser = window.localStorage.getItem(ADMIN_USER_KEY);
  if (!accessToken || !refreshToken || !rawUser) return null;

  try {
    const user = JSON.parse(rawUser) as AdminUser;
    return { accessToken, refreshToken, user };
  } catch {
    clearStoredAdminSession();
    return null;
  }
}

export function storeAdminSession(session: LoginResponse) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session.user));
}

export function clearStoredAdminSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(cmsApiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  const session = (await response.json()) as LoginResponse;
  storeAdminSession(session);
  return session;
}

export async function logoutAdmin(refreshToken?: string) {
  if (refreshToken) {
    await fetch(cmsApiUrl("/api/auth/logout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }
  clearStoredAdminSession();
}
