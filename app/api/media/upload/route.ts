import { CMS_API_BASE_URL } from "@/lib/siteApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? "";
  // Preserve original Content-Type (including multipart boundary) for the proxied request
  const contentType = request.headers.get("content-type") ?? "";
  const body = await request.arrayBuffer();

  const response = await fetch(`${CMS_API_BASE_URL}/api/media/upload`, {
    method: "POST",
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body,
  });

  const text = await response.text();

  if (!response.ok) {
    return Response.json({ error: text || `Upload lỗi ${response.status}` }, { status: response.status });
  }

  try {
    return Response.json(JSON.parse(text) as unknown);
  } catch {
    // Backend trả về URL thuần (plain text)
    return Response.json({ fileUrl: text.trim() });
  }
}
