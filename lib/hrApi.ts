// Client for the local HR/equipment/attendance modules. Unlike lib/siteApi.ts, these
// endpoints are served by this Next.js app itself (app/api/employees, app/api/equipment-assets,
// app/api/attendance) rather than proxied to the external CMS backend.

export type EmployeeStatus = "active" | "on_leave" | "inactive";

export type EmployeeRecord = {
  id: string;
  code: string;
  fullName: string;
  position: string;
  department: string;
  phone: string;
  email?: string;
  idNumber?: string;
  dateOfBirth?: string;
  hireDate?: string;
  status: EmployeeStatus;
  projectAssigned?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentAssetStatus = "available" | "in_use" | "maintenance" | "broken" | "retired";

export type EquipmentAssetRecord = {
  id: string;
  code: string;
  name: string;
  category: string;
  status: EquipmentAssetStatus;
  location?: string;
  assignedToEmployeeId?: string;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceStatus = "present" | "absent" | "leave" | "late" | "half_day";

export type AttendanceRecordItem = {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  overtimeHours?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export class ForbiddenError extends Error {
  constructor() {
    super("Không có quyền truy cập chức năng này.");
    this.name = "ForbiddenError";
  }
}

async function requestJson<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    if (response.status === 403) throw new ForbiddenError();
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `API lỗi ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type EmployeeInput = Omit<EmployeeRecord, "id" | "createdAt" | "updatedAt">;

export function listEmployees(token: string) {
  return requestJson<EmployeeRecord[]>("/api/employees", token);
}

export function createEmployee(token: string, data: EmployeeInput) {
  return requestJson<EmployeeRecord>("/api/employees", token, { method: "POST", body: JSON.stringify(data) });
}

export function updateEmployee(token: string, id: string, data: EmployeeInput) {
  return requestJson<EmployeeRecord>(`/api/employees/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteEmployee(token: string, id: string) {
  return requestJson<void>(`/api/employees/${id}`, token, { method: "DELETE" });
}

export type EquipmentAssetInput = Omit<EquipmentAssetRecord, "id" | "createdAt" | "updatedAt">;

export function listEquipmentAssets(token: string) {
  return requestJson<EquipmentAssetRecord[]>("/api/equipment-assets", token);
}

export function createEquipmentAsset(token: string, data: EquipmentAssetInput) {
  return requestJson<EquipmentAssetRecord>("/api/equipment-assets", token, { method: "POST", body: JSON.stringify(data) });
}

export function updateEquipmentAsset(token: string, id: string, data: EquipmentAssetInput) {
  return requestJson<EquipmentAssetRecord>(`/api/equipment-assets/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteEquipmentAsset(token: string, id: string) {
  return requestJson<void>(`/api/equipment-assets/${id}`, token, { method: "DELETE" });
}

export type AttendanceInput = Omit<AttendanceRecordItem, "id" | "createdAt" | "updatedAt">;

export function listAttendance(token: string, params?: { employeeId?: string; month?: string }) {
  const query = new URLSearchParams();
  if (params?.employeeId) query.set("employeeId", params.employeeId);
  if (params?.month) query.set("month", params.month);
  const qs = query.toString();
  return requestJson<AttendanceRecordItem[]>(`/api/attendance${qs ? `?${qs}` : ""}`, token);
}

export function createAttendance(token: string, data: AttendanceInput) {
  return requestJson<AttendanceRecordItem>("/api/attendance", token, { method: "POST", body: JSON.stringify(data) });
}

export function updateAttendance(token: string, id: string, data: AttendanceInput) {
  return requestJson<AttendanceRecordItem>(`/api/attendance/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteAttendance(token: string, id: string) {
  return requestJson<void>(`/api/attendance/${id}`, token, { method: "DELETE" });
}
