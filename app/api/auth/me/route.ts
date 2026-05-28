import { CMS_API_BASE_URL } from "@/lib/siteApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function forwardAuthResponse(response: Response) {
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ") || !auth.slice(7).trim()) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const external = await fetch(`${CMS_API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: auth },
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
