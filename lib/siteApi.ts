import { equipment } from "@/data/equipment";
import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { services } from "@/data/services";

const DEFAULT_CMS_API_BASE_URL = "https://huuthanhco.onrender.com";

export class ForbiddenError extends Error {
  constructor() { super("Không có quyền truy cập chức năng này."); this.name = "ForbiddenError"; }
}

export const CMS_API_BASE_URL = (process.env.NEXT_PUBLIC_CMS_API_URL ?? DEFAULT_CMS_API_BASE_URL).replace(/\/$/, "");

export type AdminRole = "super_admin" | "editor" | "hr" | "viewer";

export type AdminUserRecord = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: AdminRole;
  status: string;
};

export type ConsultationRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "done";
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type JobApplicationRecord = {
  id: string;
  jobId: string | null;
  fullName: string;
  phone: string;
  email?: string;
  positionApplied?: string;
  hasCv: boolean;
  cvFileName?: string;
  cvContentType?: string;
  cvFileSize?: number;
  message: string;
  status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  note?: string;
  jobTitle?: string;
  jobTitleEn?: string;
  createdAt: string;
  updatedAt: string;
};

export type SettingRecord = {
  key: string;
  value: string | null;
  valueEn?: string | null;
  type: "text" | "html" | "json" | "number" | "boolean";
  updatedAt?: string;
};

export type MediaRecord = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  folder: string;
  altText: string;
  altTextEn: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SettingsMap = Record<string, string | null>;

export const legacyContentFallbackEnabled = process.env.NODE_ENV !== "production";

const developmentDefaultSiteSettings: SettingsMap = {
  "company.name": "Công ty Cổ phần Xây dựng Hữu Thành",
  "company.phone": "0901 234 567",
  "company.email": "info@huuthanh.vn",
  "company.taxCode": "0309349692",
  "company.headOffice": "16 Nguyễn Văn Lượng, Phường An Nhơn, TP.HCM",
  "company.headOfficeEn": "16 Nguyen Van Luong Street, An Nhon Ward, Ho Chi Minh City, Vietnam",
  "company.transactionOffice": "30 Đường số 7, Phường Hiệp Bình, TP.HCM",
  "company.transactionOfficeEn": "30 Street No. 7, Hiep Binh Ward, Ho Chi Minh City, Vietnam",
  "company.address": "30 Đường số 7, Phường Hiệp Bình, TP.HCM",
  "company.addressEn": "30 Street No. 7, Hiep Binh Ward, Ho Chi Minh City, Vietnam",
  "company.workingHours": "Thứ 2 - Thứ 7: 8:00 - 17:30",
  "company.mapEmbedUrl":
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5822036142495!2d106.70857257535017!3d10.84325045795699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528738fc69e57%3A0xd012cb589c0da30b!2zMzAgxJAuIFPhu5EgNywgSGnhu4dwIELDrG5oLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1779174939773!5m2!1svi!2s",
  "hero.images":
    "/images/hero/Flash-4_132827290261925965.jpg\n/images/hero/Flash-5_132827290406613154.jpg\n/images/hero/Flash-6_132827290576435207.jpg\n/images/hero/Flash-7_132827290711634447.jpg\n/images/hero/Flash-8_132827290841017153.jpg",
  "hero.eyebrow": "Công Ty Cổ phần Xây Dựng Hữu Thành",
  "hero.title": "Đơn vị thi công công trình chuyên nghiệp",
  "hero.description": "Hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng thủy công, cảng biển và hạ tầng giao thông tại Việt Nam",
  "services.items": JSON.stringify(services, null, 2),
  "equipment.items": JSON.stringify(equipment, null, 2),
  "partners.images":
    "/images/doi-tac/huu-thanh-co_132747886943964272.jpg\n/images/doi-tac/huu-thanh-co_132747887169276799.jpg\n/images/doi-tac/huu-thanh-co_132747906276479099.jpg\n/images/doi-tac/huu-thanh-co_132747911027105033.jpg\n/images/doi-tac/huu-thanh-co_132747915873354052.jpg\n/images/doi-tac/huu-thanh-co_132747916552729392.jpg\n/images/doi-tac/huu-thanh-co_132747917517885233.jpg\n/images/doi-tac/huu-thanh-co_132747921285697744.jpg\n/images/doi-tac/huu-thanh-co_132747921436010275.jpg\n/images/doi-tac/huu-thanh-co_132747921578197710.jpg\n/images/doi-tac/huu-thanh-co_132747921728510246.jpg",
};

export const defaultSiteSettings: SettingsMap = legacyContentFallbackEnabled ? developmentDefaultSiteSettings : {};

export function cmsApiUrl(path: string) {
  const normalizedPath =
    CMS_API_BASE_URL.endsWith("/api") && path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;
  return `${CMS_API_BASE_URL}${normalizedPath}`;
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestJson<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(cmsApiUrl(path), {
    cache: "no-store",
    ...init,
    headers: {
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

export async function listAdminUsers(token: string) {
  return requestJson<AdminUserRecord[]>("/api/auth/users", { headers: authHeaders(token) });
}

export async function createAdminUser(token: string, data: { email: string; password: string; fullName: string; role: AdminRole }) {
  return requestJson<AdminUserRecord>("/api/auth/users", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(
  token: string,
  id: string,
  data: { email: string; password?: string; fullName: string; role: AdminRole }
) {
  return requestJson<AdminUserRecord>(`/api/auth/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteAdminUser(token: string, id: string) {
  return requestJson<void>(`/api/auth/users/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function listConsultations(token: string) {
  return requestJson<ConsultationRecord[]>("/api/consultations", { headers: authHeaders(token) });
}

export async function updateConsultationStatus(token: string, id: string, status: ConsultationRecord["status"]) {
  return requestJson<ConsultationRecord>(`/api/consultations/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export async function deleteConsultation(token: string, id: string) {
  return requestJson<void>(`/api/consultations/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function submitConsultation(data: { name: string; phone: string; email?: string; service?: string; message: string }) {
  return requestJson<ConsultationRecord>("/api/consultations", { method: "POST", body: JSON.stringify(data) });
}

export async function listJobApplications(token: string) {
  return requestJson<{ data: JobApplicationRecord[]; total: number }>("/api/job-applications?limit=100", {
    headers: authHeaders(token),
  });
}

export async function updateJobApplicationStatus(token: string, id: string, status: JobApplicationRecord["status"]) {
  return requestJson<JobApplicationRecord>(`/api/job-applications/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export async function deleteJobApplication(token: string, id: string) {
  return requestJson<void>(`/api/job-applications/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function submitJobApplication(data: {
  jobId?: string | null;
  fullName: string;
  phone: string;
  email?: string;
  positionApplied?: string;
  message: string;
}, cvFile?: File | null) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") formData.append(key, String(value));
  });
  if (cvFile) formData.append("cvFile", cvFile);

  const response = await fetch(cmsApiUrl("/api/job-applications"), {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `API lỗi ${response.status}`);
  }
  return (await response.json()) as JobApplicationRecord;
}

export async function getJobApplicationCvUrl(token: string, id: string, download = false) {
  const query = download ? "?download=1" : "";
  return requestJson<{ url: string; expiresIn: number }>(`/api/job-applications/${id}/cv${query}`, {
    headers: authHeaders(token),
  });
}

export async function createJob(token: string, data: Job) {
  return requestJson<Job>("/api/jobs", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateJob(token: string, id: string, data: Job) {
  return requestJson<Job>(`/api/jobs/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteJob(token: string, id: string) {
  return requestJson<void>(`/api/jobs/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function createNews(token: string, data: NewsItem) {
  return requestJson<NewsItem>("/api/news", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateNews(token: string, id: string, data: NewsItem) {
  return requestJson<NewsItem>(`/api/news/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteNews(token: string, id: string) {
  return requestJson<void>(`/api/news/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function createProject(token: string, data: Project) {
  return requestJson<Project>("/api/projects", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateProject(token: string, id: string, data: Project) {
  return requestJson<Project>(`/api/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteProject(token: string, id: string) {
  return requestJson<void>(`/api/projects/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function getSettingsMap(prefix?: string) {
  const query = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
  const settings = await requestJson<SettingsMap>(`/api/settings${query}`);
  return { ...defaultSiteSettings, ...settings };
}

export async function getSettingsFull(token?: string) {
  return requestJson<SettingRecord[]>("/api/settings?full=true", { headers: authHeaders(token) });
}

export async function saveSettingsBulk(token: string, settings: SettingRecord[]) {
  return requestJson<SettingRecord[]>("/api/settings/bulk", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(settings.map(({ key, value, valueEn, type }) => ({ key, value: value ?? "", valueEn: valueEn ?? undefined, type }))),
  });
}

export async function listMedia(token: string, folder?: string) {
  const query = folder ? `?folder=${encodeURIComponent(folder)}` : "";
  return requestJson<MediaRecord[]>(`/api/media${query}`, { headers: authHeaders(token) });
}

export async function createMedia(token: string, data: Omit<MediaRecord, "id">) {
  return requestJson<MediaRecord>("/api/media", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function deleteMedia(token: string, id: string) {
  return requestJson<void>(`/api/media/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export async function uploadMedia(
  token: string,
  file: File,
  folder: string,
  altText = "",
  altTextEn = "",
): Promise<MediaRecord> {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("folder", folder);
  formData.append("altText", altText || file.name);
  formData.append("altTextEn", altTextEn || file.name);

  const response = await fetch(cmsApiUrl("/api/media/upload"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Upload lỗi ${response.status}`);
  }

  const data = (await response.json()) as unknown;

  // API trả về { items: [MediaRecord] }
  const findRecord = (obj: unknown): MediaRecord | null => {
    if (!obj || typeof obj !== "object") return null;
    if (Array.isArray(obj)) return findRecord(obj[0]);
    const o = obj as Record<string, unknown>;
    if (typeof o.fileUrl === "string") return o as unknown as MediaRecord;
    return findRecord(o.items) ?? findRecord(o.data) ?? findRecord(o.result) ?? null;
  };

  const record = findRecord(data);
  if (!record?.fileUrl) throw new Error(`Upload thành công nhưng không tìm được URL. Response: ${JSON.stringify(data)}`);
  return record;
}

export function mediaFileUrl(fileUrl: string) {
  if (!fileUrl) return "";
  if (/^(https?:|data:|blob:)/.test(fileUrl)) return fileUrl;
  if (fileUrl.startsWith("/images/")) return fileUrl;
  if (fileUrl.startsWith("/")) return `${CMS_API_BASE_URL}${fileUrl}`;
  return `${CMS_API_BASE_URL}/uploads/${fileUrl.replace(/^\/+/, "")}`;
}

export function getSetting(settings: SettingsMap, key: string) {
  return settings[key] ?? defaultSiteSettings[key] ?? "";
}

export function settingLines(settings: SettingsMap, key: string) {
  return String(getSetting(settings, key))
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function settingJson<T>(settings: SettingsMap, key: string, fallback: T): T {
  const raw = getSetting(settings, key);
  const allowedFallback = legacyContentFallbackEnabled ? fallback : ([] as unknown as T);
  if (!raw) return allowedFallback;
  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return allowedFallback;
  }
}
