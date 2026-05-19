import { CMS_API_BASE_URL } from "@/lib/siteApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.replace("Bearer ", "").trim();

  // Proxy to external backend first (server-to-server, no CORS)
  const external = await fetch(`${CMS_API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (external?.ok) return Response.json({ ok: true });

  // Validate local-issued tokens
  if (token.startsWith("local-access-")) return Response.json({ ok: true });

  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
