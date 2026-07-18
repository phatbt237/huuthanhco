import { CMS_API_BASE_URL } from "@/lib/siteApi";
import { readRequestBytes, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_LOGOUT_REQUEST_SIZE = 16 * 1024;

export async function POST(request: Request) {
  let body: string;
  try {
    body = new TextDecoder().decode(await readRequestBytes(request, MAX_LOGOUT_REQUEST_SIZE));
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Dữ liệu đăng xuất quá lớn." }, { status: 413 });
    }
    return Response.json({ error: "Dữ liệu đăng xuất không hợp lệ." }, { status: 400 });
  }
  const external = await fetch(`${CMS_API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  }).catch(() => null);

  if (!external) {
    return Response.json(
      { error: "Không thể kết nối máy chủ xác thực." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (external.status === 204) {
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(await external.text(), {
    status: external.status,
    headers: { "Cache-Control": "no-store" },
  });
}
