import { CMS_API_BASE_URL } from "@/lib/siteApi";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_LOGIN_REQUEST_SIZE = 8 * 1024;

async function forwardAuthResponse(response: Response) {
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await readJsonBody(request, MAX_LOGIN_REQUEST_SIZE);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Dữ liệu đăng nhập quá lớn." }, { status: 413 });
    }
    return Response.json({ error: "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }

  const external = await fetch(`${CMS_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  }).catch(() => null);

  if (!external) {
    return Response.json(
      { error: "Không thể kết nối máy chủ xác thực." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return forwardAuthResponse(external);
}
