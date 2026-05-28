import { CMS_API_BASE_URL } from "@/lib/siteApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
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
