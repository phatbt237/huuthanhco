import type {
  AttendanceInput,
  AttendanceStatus,
  EmployeeInput,
  EmployeeStatus,
  EquipmentAssetInput,
  EquipmentAssetStatus,
} from "@/lib/hrApi";

const EMPLOYEE_STATUSES: EmployeeStatus[] = ["active", "on_leave", "inactive"];
const EQUIPMENT_STATUSES: EquipmentAssetStatus[] = ["available", "in_use", "maintenance", "broken", "retired"];
const ATTENDANCE_STATUSES: AttendanceStatus[] = ["present", "absent", "leave", "late", "half_day"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

export function parseEmployeePayload(body: unknown): EmployeeInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  if (!isNonEmptyString(data.code) || !isNonEmptyString(data.fullName)) return null;

  const status = EMPLOYEE_STATUSES.includes(data.status as EmployeeStatus) ? (data.status as EmployeeStatus) : "active";

  return {
    code: data.code.trim(),
    fullName: data.fullName.trim(),
    position: optionalString(data.position) ?? "",
    department: optionalString(data.department) ?? "",
    phone: optionalString(data.phone) ?? "",
    email: optionalString(data.email),
    idNumber: optionalString(data.idNumber),
    dateOfBirth: optionalString(data.dateOfBirth),
    hireDate: optionalString(data.hireDate),
    status,
    projectAssigned: optionalString(data.projectAssigned),
    notes: optionalString(data.notes),
  };
}

export function parseEquipmentAssetPayload(body: unknown): EquipmentAssetInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  if (!isNonEmptyString(data.code) || !isNonEmptyString(data.name)) return null;

  const status = EQUIPMENT_STATUSES.includes(data.status as EquipmentAssetStatus)
    ? (data.status as EquipmentAssetStatus)
    : "available";

  return {
    code: data.code.trim(),
    name: data.name.trim(),
    category: optionalString(data.category) ?? "",
    status,
    location: optionalString(data.location),
    assignedToEmployeeId: optionalString(data.assignedToEmployeeId),
    purchaseDate: optionalString(data.purchaseDate),
    lastMaintenanceDate: optionalString(data.lastMaintenanceDate),
    nextMaintenanceDate: optionalString(data.nextMaintenanceDate),
    notes: optionalString(data.notes),
  };
}

export function parseAttendancePayload(body: unknown): AttendanceInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  if (!isNonEmptyString(data.employeeId) || !isNonEmptyString(data.date) || !DATE_RE.test(data.date)) return null;

  const status = ATTENDANCE_STATUSES.includes(data.status as AttendanceStatus)
    ? (data.status as AttendanceStatus)
    : "present";
  const overtimeHours = typeof data.overtimeHours === "number" && Number.isFinite(data.overtimeHours)
    ? data.overtimeHours
    : undefined;

  return {
    employeeId: data.employeeId.trim(),
    date: data.date,
    checkIn: optionalString(data.checkIn),
    checkOut: optionalString(data.checkOut),
    status,
    overtimeHours,
    note: optionalString(data.note),
  };
}
