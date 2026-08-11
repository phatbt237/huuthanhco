import { randomUUID } from "node:crypto";
import { authenticateAdminUser } from "@/lib/server/adminRouteAuth";
import { createItem, listItems } from "@/lib/server/localStore";
import { parseEmployeePayload } from "@/lib/server/hrValidation";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";
import { canAccess, canWrite } from "@/lib/permissions";
import type { EmployeeRecord } from "@/lib/hrApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STORE_FILE = "employees.json";
const MAX_REQUEST_SIZE = 16 * 1024;

function forbidden() {
  return Response.json(
    { error: "Không có quyền truy cập chức năng này." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const auth = await authenticateAdminUser(request);
  if (auth.response) return auth.response;
  if (!canAccess(auth.user.role, "employees")) return forbidden();

  const items = await listItems<EmployeeRecord>(STORE_FILE);
  items.sort((a, b) => a.fullName.localeCompare(b.fullName, "vi"));
  return Response.json(items, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await authenticateAdminUser(request);
  if (auth.response) return auth.response;
  if (!canWrite(auth.user.role, "employees")) return forbidden();

  let body: unknown;
  try {
    body = await readJsonBody(request, MAX_REQUEST_SIZE);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Dữ liệu quá lớn." }, { status: 413 });
    }
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const payload = parseEmployeePayload(body);
  if (!payload) {
    return Response.json({ error: "Thiếu thông tin bắt buộc (mã nhân viên, họ tên)." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const item: EmployeeRecord = { id: randomUUID(), ...payload, createdAt: now, updatedAt: now };
  await createItem(STORE_FILE, item);
  return Response.json(item, { status: 201, headers: { "Cache-Control": "no-store" } });
}
