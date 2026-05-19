export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.replace("Bearer ", "").trim();

  if (token.startsWith("local-access-")) {
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
