import { CMS_API_BASE_URL, type AdminRole } from "@/lib/siteApi";

export type AuthenticatedAdminUser = {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminRole;
};

type AuthResult =
  | { authorization: string; response?: never }
  | { authorization?: never; response: Response };

type AuthUserResult =
  | { authorization: string; user: AuthenticatedAdminUser; response?: never }
  | { authorization?: never; user?: never; response: Response };

function unauthorized(message = "Unauthorized") {
  return Response.json(
    { error: message },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
        "WWW-Authenticate": "Bearer",
      },
    },
  );
}

function isAuthenticatedAdminUser(value: unknown): value is AuthenticatedAdminUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthenticatedAdminUser>;
  return (
    typeof user.id === "string"
    && typeof user.email === "string"
    && ["super_admin", "editor", "hr", "viewer"].includes(String(user.role))
  );
}

export async function authenticateAdminUser(request: Request): Promise<AuthUserResult> {
  const authorization = request.headers.get("authorization")?.trim() ?? "";
  if (!/^Bearer\s+\S+$/i.test(authorization)) {
    return { response: unauthorized() };
  }

  const verification = await fetch(`${CMS_API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: authorization },
    cache: "no-store",
  }).catch(() => null);

  if (!verification) {
    return {
      response: Response.json(
        { error: "Không thể kết nối máy chủ xác thực." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  if (!verification.ok) {
    return { response: unauthorized("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.") };
  }

  const user = await verification.json().catch(() => null);
  if (!isAuthenticatedAdminUser(user)) {
    return { response: unauthorized("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.") };
  }

  return { authorization, user };
}

export async function authenticateAdminRequest(request: Request): Promise<AuthResult> {
  const result = await authenticateAdminUser(request);
  if (result.response) return { response: result.response };
  return { authorization: result.authorization };
}
