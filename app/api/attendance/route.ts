import { randomUUID } from "node:crypto";
import { authenticateAdminUser } from "@/lib/server/adminRouteAuth";
import { createItem, listItems, updateItem } from "@/lib/server/localStore";
import { parseAttendancePayload } from "@/lib/server/hrValidation";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";
import { canAccess, canWrite } from "@/lib/permissions";
import type { AttendanceRecordItem } from "@/lib/hrApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STORE_FILE = "attendance.json";
const MAX_REQUEST_SIZE = 16 * 1024;
const MONTH_RE = /^\d{4}-\d{2}$/;

function forbidden() {
  return Response.json(
    { error: "Không có quyền truy cập chức năng này." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const auth = await authenticateAdminUser(request);
  if (auth.response) return auth.response;
  if (!canAccess(auth.user.role, "attendance")) return forbidden();

  const url = new URL(request.url);
  const employeeId = url.searchParams.get("employeeId");
  const month = url.searchParams.get("month");

  let items = await listItems<AttendanceRecordItem>(STORE_FILE);
  if (employeeId) items = items.filter((item) => item.employeeId === employeeId);
  if (month && MONTH_RE.test(month)) items = items.filter((item) => item.date.startsWith(month));
  items.sort((a, b) => b.date.localeCompare(a.date));

  return Response.json(items, { headers: { "Cache-Control": "no-store" } });
}

// Marking attendance is idempotent per employee/day: re-submitting the same
// employeeId + date updates that day's record instead of creating a duplicate.
export async function POST(request: Request) {
  const auth = await authenticateAdminUser(request);
  if (auth.response) return auth.response;
  if (!canWrite(auth.user.role, "attendance")) return forbidden();

  let body: unknown;
  try {
    body = await readJsonBody(request, MAX_REQUEST_SIZE);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Dữ liệu quá lớn." }, { status: 413 });
    }
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const payload = parseAttendancePayload(body);
  if (!payload) {
    return Response.json({ error: "Thiếu thông tin bắt buộc (nhân viên, ngày công)." }, { status: 400 });
  }

  const existing = (await listItems<AttendanceRecordItem>(STORE_FILE)).find(
    (item) => item.employeeId === payload.employeeId && item.date === payload.date,
  );

  if (existing) {
    const updated = await updateItem<AttendanceRecordItem>(STORE_FILE, existing.id, (item) => ({
      ...item,
      ...payload,
      updatedAt: new Date().toISOString(),
    }));
    return Response.json(updated, { headers: { "Cache-Control": "no-store" } });
  }

  const now = new Date().toISOString();
  const item: AttendanceRecordItem = { id: randomUUID(), ...payload, createdAt: now, updatedAt: now };
  await createItem(STORE_FILE, item);
  return Response.json(item, { status: 201, headers: { "Cache-Control": "no-store" } });
}
