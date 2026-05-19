import { randomUUID } from "node:crypto";
import { CMS_API_BASE_URL } from "@/lib/siteApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackAdmins = [
  {
    id: "local-super-admin",
    email: process.env.ADMIN_EMAIL ?? "admin@huuthanh.vn",
    password: process.env.ADMIN_PASSWORD ?? "Admin@123456",
    fullName: "Hữu Thành Admin",
    role: "super_admin" as const,
    status: "active",
  },
];

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };

  // Proxy to external backend first (server-to-server, no CORS)
  const external = await fetch(`${CMS_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  }).catch(() => null);

  if (external?.ok) {
    const data = await external.json();
    return Response.json(data);
  }

  // Fallback: check local credentials
  const email = normalize(body.email);
  const password = String(body.password ?? "");
  const admin = fallbackAdmins.find(
    (item) => normalize(item.email) === email && item.password === password
  );

  if (!admin) {
    return Response.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  return Response.json({
    accessToken: `local-access-${randomUUID()}`,
    refreshToken: `local-refresh-${randomUUID()}`,
    user: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      status: admin.status,
    },
  });
}
