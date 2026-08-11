import { authenticateAdminUser } from "@/lib/server/adminRouteAuth";
import { deleteItem, updateItem } from "@/lib/server/localStore";
import { parseAttendancePayload } from "@/lib/server/hrValidation";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/server/requestSecurity";
import { canDelete, canWrite } from "@/lib/permissions";
import type { AttendanceRecordItem } from "@/lib/hrApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STORE_FILE = "attendance.json";
const MAX_REQUEST_SIZE = 16 * 1024;

function forbidden() {
  return Response.json(
    { error: "Không có quyền truy cập chức năng này." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params;
  const updated = await updateItem<AttendanceRecordItem>(STORE_FILE, id, (existing) => ({
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  }));

  if (!updated) return Response.json({ error: "Không tìm thấy bản ghi chấm công." }, { status: 404 });
  return Response.json(updated, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateAdminUser(request);
  if (auth.response) return auth.response;
  if (!canDelete(auth.user.role, "attendance")) return forbidden();

  const { id } = await params;
  const removed = await deleteItem(STORE_FILE, id);
  if (!removed) return Response.json({ error: "Không tìm thấy bản ghi chấm công." }, { status: 404 });
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
