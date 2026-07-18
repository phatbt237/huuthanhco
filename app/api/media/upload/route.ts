import { CMS_API_BASE_URL } from "@/lib/siteApi";
import { authenticateAdminRequest } from "@/lib/server/adminRouteAuth";
import { readRequestBytes, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_UPLOAD_REQUEST_SIZE = 55 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await authenticateAdminRequest(request);
  if (auth.response) return auth.response;

  const contentType = request.headers.get("content-type") ?? "";
  if (!/^multipart\/form-data;\s*boundary=/i.test(contentType)) {
    return Response.json({ error: "Content-Type phải là multipart/form-data." }, { status: 415 });
  }

  let body: ArrayBuffer;
  try {
    body = await readRequestBytes(request, MAX_UPLOAD_REQUEST_SIZE);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Tổng dung lượng upload vượt quá 55 MB." }, { status: 413 });
    }
    return Response.json({ error: "Không thể đọc dữ liệu upload." }, { status: 400 });
  }

  const response = await fetch(`${CMS_API_BASE_URL}/api/media/upload`, {
    method: "POST",
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      Authorization: auth.authorization,
    },
    body,
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    return Response.json(
      { error: response.status === 401 || response.status === 403 ? "Không có quyền upload." : `Upload lỗi ${response.status}` },
      { status: response.status, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    return Response.json(JSON.parse(text) as unknown);
  } catch {
    // Backend trả về URL thuần (plain text)
    return Response.json({ fileUrl: text.trim() });
  }
}
