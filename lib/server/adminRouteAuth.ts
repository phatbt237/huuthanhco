import { CMS_API_BASE_URL } from "@/lib/siteApi";

type AuthResult =
  | { authorization: string; response?: never }
  | { authorization?: never; response: Response };

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

export async function authenticateAdminRequest(request: Request): Promise<AuthResult> {
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

  return { authorization };
}
