"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderOpen,
  Inbox,
  Lock,
  Loader2,
  LogOut,
  Mail,
  Newspaper,
  Plus,
  Save,
  Search,
  Settings,
  Star,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import AdminExtraPanels, { type ExtraAdminTab } from "@/components/AdminExtraPanels";
import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { clearCmsContent, fetchCmsContent, saveCmsContent, type CmsContent } from "@/lib/cmsContent";
import {
  getStoredAdminSession,
  loginAdmin,
  logoutAdmin,
  validateAdminSession,
  type AdminUser,
} from "@/lib/adminAuth";
import { listMedia, mediaFileUrl, uploadMedia, type MediaRecord } from "@/lib/siteApi";

type CmsTab = "news" | "projects" | "jobs";
type Tab = CmsTab | ExtraAdminTab;
type Session = {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

const projectCategories = [
  { value: "Cảng biển", valueEn: "Seaport" },
  { value: "Thủy lợi", valueEn: "Hydraulics" },
  { value: "Nạo vét", valueEn: "Dredging" },
  { value: "Hạ tầng", valueEn: "Infrastructure" },
  { value: "Dịch vụ", valueEn: "Services" },
];

const projectLocations = [
  // Vùng / tổng hợp
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
  "Toàn quốc",
  // 63 tỉnh thành
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const blankNews: NewsItem = {
  id: "",
  title: "",
  titleEn: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Tin tức",
  categoryEn: "News",
  thumbnail: "",
  galleryImages: [],
  excerpt: "",
  excerptEn: "",
  content: "",
  contentEn: "",
};

const blankProject: Project = {
  id: "",
  name: "",
  nameEn: "",
  location: "TP. Hồ Chí Minh",
  year: new Date().getFullYear(),
  category: "Cảng biển",
  categoryEn: "Seaport",
  image: "",
  galleryImages: [],
  description: "",
  descriptionEn: "",
};

const blankJob: Job = {
  id: "",
  title: "",
  titleEn: "",
  location: "TP. Hồ Chí Minh",
  type: "Toàn thời gian",
  typeEn: "Full-time",
  salary: "Thỏa thuận",
  description: "",
  descriptionEn: "",
  requirements: [],
  requirementsEn: [],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now().toString(36)}`;
}

function listToText(items: string[]) {
  return items.join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      const storedSession = getStoredAdminSession();
      if (!storedSession) {
        if (!ignore) setIsCheckingSession(false);
        return;
      }

      const isValid = await validateAdminSession(storedSession);
      if (ignore) return;

      if (isValid) {
        setSession(storedSession);
      } else {
        await logoutAdmin(storedSession.refreshToken);
        setSession(null);
      }
      setIsCheckingSession(false);
    };

    void checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (isCheckingSession || session) return;
    const redirectUrl = `${window.location.origin}${pathname || "/admin"}`;
    router.replace(`/admin/auth/login?url=${encodeURIComponent(redirectUrl)}`);
  }, [isCheckingSession, pathname, router, session]);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Đang kiểm tra phiên đăng nhập…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Đang chuyển đến trang đăng nhập…</span>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      session={session}
      onLogout={() => {
        void logoutAdmin(session.refreshToken).finally(() => {
          setSession(null);
          const redirectUrl = `${window.location.origin}/admin`;
          router.replace(`/admin/auth/login?url=${encodeURIComponent(redirectUrl)}`);
        });
      }}
    />
  );
}

export function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      const currentSession = getStoredAdminSession();
      if (!currentSession) {
        if (!ignore) setIsCheckingSession(false);
        return;
      }

      const isValid = await validateAdminSession(currentSession);
      if (ignore) return;

      if (isValid) {
        router.replace(getSafeRedirect(searchParams.get("url")));
        return;
      }

      await logoutAdmin(currentSession.refreshToken);
      setIsCheckingSession(false);
    };

    void checkSession();
    return () => {
      ignore = true;
    }
  }, [router, searchParams]);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Đang kiểm tra phiên đăng nhập…</span>
        </div>
      </div>
    );
  }

  return (
    <AdminLogin
      onLoggedIn={() => {
        router.replace(getSafeRedirect(searchParams.get("url")));
      }}
    />
  );
}

function AdminLogin({ onLoggedIn }: { onLoggedIn: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      onLoggedIn(await loginAdmin(email.trim(), password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không đăng nhập được.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020a22] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(0,132,255,0.55),transparent_32%),radial-gradient(circle_at_48%_28%,rgba(10,201,255,0.3),transparent_22%),linear-gradient(90deg,#053f91_0%,#06286b_34%,#03091f_78%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(120deg,transparent_0_45%,rgba(76,201,255,0.35)_45.5%,transparent_46%),linear-gradient(60deg,transparent_0_52%,rgba(76,201,255,0.22)_52.5%,transparent_53%)] [background-size:180px_180px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[31rem]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center bg-white/95 p-2 shadow-lg">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/69ba7546394f41773827398.jpg"
                alt="Hữu Thành"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-3xl font-black tracking-tight text-cyan-200">Hữu Thành</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.35em] text-cyan-100/70">Admin Login</div>
          </div>

          <form onSubmit={submit} className="bg-white p-7 text-slate-950 shadow-2xl shadow-black/30">
            <h1 className="mb-6 text-center text-xl font-black text-slate-600">Đăng nhập</h1>

            {error && (
              <div className="mb-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <LoginField
                icon={<Mail size={20} />}
                placeholder="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="username"
              />
              <LoginField
                icon={<Lock size={20} />}
                placeholder="Mật khẩu"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            </div>

            <button
              disabled={isSubmitting}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#3f98c4] px-5 text-base font-black text-white transition-colors hover:bg-[#2f86b2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function getSafeRedirect(rawUrl: string | null) {
  if (!rawUrl) return "/admin";
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (parsed.origin !== window.location.origin) return "/admin";
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/admin";
  } catch {
    return "/admin";
  }
}

function AdminDashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [content, setContent] = useState<CmsContent>({ news: [], projects: [], jobs: [] });
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [newsForm, setNewsForm] = useState<NewsItem>(blankNews);
  const [projectForm, setProjectForm] = useState<Project>(blankProject);
  const [jobForm, setJobForm] = useState<Job>(blankJob);
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobRequirementsEn, setJobRequirementsEn] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusKind, setStatusKind] = useState<"success" | "error">("success");
  const [mediaLibrary, setMediaLibrary] = useState<MediaRecord[]>([]);

  const refreshMediaLibrary = () => {
    void listMedia(session.accessToken).then(setMediaLibrary).catch(() => setMediaLibrary([]));
  };

  useEffect(() => {
    void fetchCmsContent().then(setContent);
    refreshMediaLibrary();
  }, [session.accessToken]);

  const currentItems = useMemo(() => {
    if (!isCmsTab(activeTab)) return [];
    const items = activeTab === "news" ? content.news : activeTab === "projects" ? content.projects : content.jobs;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => getItemTitle(item).toLowerCase().includes(normalized) || item.id.toLowerCase().includes(normalized));
  }, [activeTab, content, query]);

  const showStatus = (message: string, kind: "success" | "error" = "success") => {
    setStatusMessage(message);
    setStatusKind(kind);
  };

  const persist = async (nextContent: CmsContent) => {
    setIsSaving(true);
    setStatusMessage("");
    try {
      await saveCmsContent(nextContent, { token: session.accessToken });
      const savedContent = await fetchCmsContent();
      setContent(savedContent);
      showStatus("Đã lưu dữ liệu CMS.");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Không lưu được dữ liệu CMS.", "error");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetFields = () => {
    setEditingId(null);
    setNewsForm(blankNews);
    setProjectForm(blankProject);
    setJobForm(blankJob);
    setJobRequirements("");
    setJobRequirementsEn("");
  };

  const resetForm = () => {
    resetFields();
    setIsEditorOpen(false);
  };

  const openCreateForm = () => {
    resetFields();
    setIsEditorOpen(true);
  };

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setQuery("");
    resetForm();
  };

  const editItem = (id: string) => {
    setEditingId(id);
    setIsEditorOpen(true);
    if (activeTab === "news") {
      const item = content.news.find((entry) => entry.id === id);
      if (item) {
        const merged = Array.from(new Set([item.thumbnail, ...(item.galleryImages ?? [])].filter(Boolean)));
        setNewsForm({ ...item, galleryImages: merged });
      }
    }
    if (activeTab === "projects") {
      const item = content.projects.find((entry) => entry.id === id);
      if (item) {
        const merged = Array.from(new Set([item.image, ...(item.galleryImages ?? [])].filter(Boolean)));
        setProjectForm({ ...item, galleryImages: merged });
      }
    }
    if (activeTab === "jobs") {
      const item = content.jobs.find((entry) => entry.id === id);
      if (item) {
        setJobForm(item);
        setJobRequirements(listToText(item.requirements));
        setJobRequirementsEn(listToText(item.requirementsEn));
      }
    }
  };

  const removeItem = (id: string) => {
    if (!window.confirm("Xóa nội dung này?")) return;
    const nextContent: CmsContent = {
      news: content.news.filter((item) => item.id !== id),
      projects: content.projects.filter((item) => item.id !== id),
      jobs: content.jobs.filter((item) => item.id !== id),
    };
    void persist(nextContent).then(resetForm);
  };

  const saveNews = async () => {
    const gallery = (newsForm.galleryImages ?? []).filter(Boolean);
    const thumbnail = (newsForm.thumbnail && gallery.includes(newsForm.thumbnail))
      ? newsForm.thumbnail
      : gallery[0] ?? newsForm.thumbnail ?? "";
    const item: NewsItem = {
      ...newsForm,
      id: newsForm.id || nextId("news"),
      slug: newsForm.slug || slugify(newsForm.title),
      titleEn: newsForm.titleEn || newsForm.title,
      categoryEn: newsForm.categoryEn || newsForm.category,
      excerptEn: newsForm.excerptEn || newsForm.excerpt,
      contentEn: newsForm.contentEn || newsForm.content,
      thumbnail,
      galleryImages: gallery,
    };
    await persist({ ...content, news: upsert(content.news, item) });
    resetForm();
  };

  const saveProject = async () => {
    const gallery = (projectForm.galleryImages ?? []).filter(Boolean);
    const image = (projectForm.image && gallery.includes(projectForm.image))
      ? projectForm.image
      : gallery[0] ?? projectForm.image ?? "";
    const item: Project = {
      ...projectForm,
      id: projectForm.id || nextId("project"),
      year: Number(projectForm.year) || new Date().getFullYear(),
      nameEn: projectForm.nameEn || projectForm.name,
      categoryEn: projectForm.categoryEn || projectForm.category,
      descriptionEn: projectForm.descriptionEn || projectForm.description,
      image,
      galleryImages: gallery,
    };
    await persist({ ...content, projects: upsert(content.projects, item) });
    resetForm();
  };

  const saveJob = async () => {
    const item: Job = {
      ...jobForm,
      id: jobForm.id || nextId("job"),
      titleEn: jobForm.titleEn || jobForm.title,
      typeEn: jobForm.typeEn || jobForm.type,
      descriptionEn: jobForm.descriptionEn || jobForm.description,
      requirements: textToList(jobRequirements),
      requirementsEn: textToList(jobRequirementsEn || jobRequirements),
    };
    await persist({ ...content, jobs: upsert(content.jobs, item) });
    resetForm();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "huu-thanh-cms-content.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    const imported = JSON.parse(text) as Partial<CmsContent>;
    await persist({
      news: Array.isArray(imported.news) ? imported.news : [],
      projects: Array.isArray(imported.projects) ? imported.projects : [],
      jobs: Array.isArray(imported.jobs) ? imported.jobs : [],
    });
    resetForm();
  };

  const clearAll = async () => {
    if (!window.confirm("Xóa toàn bộ dữ liệu CMS?")) return;
    try {
      await clearCmsContent({ token: session.accessToken });
      setContent({ news: [], projects: [], jobs: [] });
      resetForm();
      showStatus("Đã xóa dữ liệu CMS.");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Không xóa được dữ liệu CMS.", "error");
    }
  };

  const userInitial = (session.user.fullName || session.user.email)[0].toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-900">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-700/60 px-4 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 p-1">
            <img
              src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/69ba7546394f41773827398.jpg"
              alt="Hữu Thành"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-white">Hữu Thành</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection label="Nội dung">
            <SideNavItem icon={<FolderOpen size={16} />} label="Dự án" active={activeTab === "projects"} onClick={() => changeTab("projects")} />
            <SideNavItem icon={<Newspaper size={16} />} label="Tin tức" active={activeTab === "news"} onClick={() => changeTab("news")} />
            <SideNavItem icon={<Briefcase size={16} />} label="Tuyển dụng" active={activeTab === "jobs"} onClick={() => changeTab("jobs")} />
          </NavSection>
          <NavSection label="Liên hệ">
            <SideNavItem icon={<Inbox size={16} />} label="Hộp thư" active={activeTab === "contacts"} onClick={() => changeTab("contacts")} />
            <SideNavItem icon={<UserCheck size={16} />} label="Ứng tuyển" active={activeTab === "applications"} onClick={() => changeTab("applications")} />
          </NavSection>
          <NavSection label="Hệ thống">
            <SideNavItem icon={<Users size={16} />} label="Tài khoản" active={activeTab === "accounts"} onClick={() => changeTab("accounts")} />
            <SideNavItem icon={<Settings size={16} />} label="Cài đặt" active={activeTab === "settings"} onClick={() => changeTab("settings")} />
          </NavSection>
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-700/60 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">{session.user.fullName || session.user.email}</div>
              <div className="truncate text-[11px] text-slate-500">{session.user.email}</div>
            </div>
            <button
              onClick={onLogout}
              title="Đăng xuất"
              className="flex-shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        {/* Page header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-slate-900">{tabTitle(activeTab)}</h1>
              <p className="mt-0.5 text-xs font-medium text-slate-400">Hữu Thành Construction · Quản trị nội dung</p>
            </div>

          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-8">
          {statusMessage && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${
                statusKind === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {statusKind === "error"
                ? <AlertCircle className="shrink-0" size={17} />
                : <CheckCircle2 className="shrink-0" size={17} />}
              {statusMessage}
            </div>
          )}

          {isCmsTab(activeTab) ? (
            isEditorOpen ? (
              /* ── Editor ── */
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-red-500">
                      {editingId ? "Chỉnh sửa" : "Tạo mới"}
                    </div>
                    <h2 className="mt-0.5 text-xl font-black text-slate-900">{tabTitle(activeTab)}</h2>
                  </div>
                  <button
                    onClick={resetForm}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    ← Quay lại danh sách
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "news" && (
                    <div className="space-y-5">
                      <FormHeader title="Tin tức" onDelete={newsForm.id ? () => removeItem(newsForm.id) : undefined} />
                      <Input label="Tiêu đề" value={newsForm.title} onChange={(v) => setNewsForm({ ...newsForm, title: v, slug: newsForm.slug || slugify(v) })} />
                      <Input label="Tiêu đề EN" value={newsForm.titleEn} onChange={(v) => setNewsForm({ ...newsForm, titleEn: v })} />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Input label="Slug" value={newsForm.slug} onChange={(v) => setNewsForm({ ...newsForm, slug: slugify(v) })} />
                        <Input label="Ngày" type="date" value={newsForm.date} onChange={(v) => setNewsForm({ ...newsForm, date: v })} />
                        <Input label="Danh mục" value={newsForm.category} onChange={(v) => setNewsForm({ ...newsForm, category: v })} />
                        <Input label="Danh mục EN" value={newsForm.categoryEn} onChange={(v) => setNewsForm({ ...newsForm, categoryEn: v })} />
                      </div>
                      <GalleryWithThumbnail
                        label="Ảnh tin tức"
                        images={newsForm.galleryImages ?? []}
                        thumbnail={newsForm.thumbnail}
                        media={mediaLibrary}
                        token={session.accessToken}
                        folder="news"
                        onImagesChange={(v) => setNewsForm({ ...newsForm, galleryImages: v })}
                        onThumbnailChange={(v) => setNewsForm({ ...newsForm, thumbnail: v })}
                        onUploaded={(item) => setMediaLibrary((prev) => [item, ...prev.filter((m) => m.id !== item.id)])}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Textarea label="Mô tả ngắn (VI)" value={newsForm.excerpt} onChange={(v) => setNewsForm({ ...newsForm, excerpt: v })} />
                        <Textarea label="Mô tả ngắn (EN)" value={newsForm.excerptEn} onChange={(v) => setNewsForm({ ...newsForm, excerptEn: v })} />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Textarea label="Nội dung (VI)" rows={8} value={newsForm.content} onChange={(v) => setNewsForm({ ...newsForm, content: v })} />
                        <Textarea label="Nội dung (EN)" rows={8} value={newsForm.contentEn} onChange={(v) => setNewsForm({ ...newsForm, contentEn: v })} />
                      </div>
                      <SaveButton disabled={isSaving} onClick={saveNews} />
                    </div>
                  )}

                  {activeTab === "projects" && (
                    <div className="space-y-5">
                      <FormHeader title="Dự án" onDelete={projectForm.id ? () => removeItem(projectForm.id) : undefined} />
                      <Input label="Tên dự án" value={projectForm.name} onChange={(v) => setProjectForm({ ...projectForm, name: v })} />
                      <Input label="Tên dự án EN" value={projectForm.nameEn} onChange={(v) => setProjectForm({ ...projectForm, nameEn: v })} />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SelectField
                          label="Địa điểm"
                          value={projectForm.location}
                          onChange={(v) => setProjectForm({ ...projectForm, location: v })}
                          options={projectLocations.map((location) => ({ value: location, label: location }))}
                        />
                        <Input label="Năm" type="number" value={String(projectForm.year)} onChange={(v) => setProjectForm({ ...projectForm, year: Number(v) })} />
                        <SelectField
                          label="Loại"
                          value={projectForm.category}
                          onChange={(v) => {
                            const category = projectCategories.find((item) => item.value === v);
                            setProjectForm({ ...projectForm, category: v, categoryEn: category?.valueEn ?? v });
                          }}
                          options={projectCategories.map((category) => ({ value: category.value, label: category.value }))}
                        />
                      </div>
                      <GalleryWithThumbnail
                        label="Ảnh dự án"
                        images={projectForm.galleryImages ?? []}
                        thumbnail={projectForm.image}
                        media={mediaLibrary}
                        token={session.accessToken}
                        folder="projects"
                        onImagesChange={(v) => setProjectForm({ ...projectForm, galleryImages: v })}
                        onThumbnailChange={(v) => setProjectForm({ ...projectForm, image: v })}
                        onUploaded={(item) => setMediaLibrary((prev) => [item, ...prev.filter((m) => m.id !== item.id)])}
                      />
                      <Textarea label="Mô tả" value={projectForm.description} onChange={(v) => setProjectForm({ ...projectForm, description: v })} />
                      <Textarea label="Mô tả EN" value={projectForm.descriptionEn} onChange={(v) => setProjectForm({ ...projectForm, descriptionEn: v })} />
                      <SaveButton disabled={isSaving} onClick={saveProject} />
                    </div>
                  )}

                  {activeTab === "jobs" && (
                    <div className="space-y-5">
                      <FormHeader title="Tuyển dụng" onDelete={jobForm.id ? () => removeItem(jobForm.id) : undefined} />
                      <Input label="Vị trí" value={jobForm.title} onChange={(v) => setJobForm({ ...jobForm, title: v })} />
                      <Input label="Vị trí EN" value={jobForm.titleEn} onChange={(v) => setJobForm({ ...jobForm, titleEn: v })} />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input label="Địa điểm" value={jobForm.location} onChange={(v) => setJobForm({ ...jobForm, location: v })} />
                        <Input label="Loại hình" value={jobForm.type} onChange={(v) => setJobForm({ ...jobForm, type: v })} />
                        <Input label="Lương" value={jobForm.salary} onChange={(v) => setJobForm({ ...jobForm, salary: v })} />
                      </div>
                      <Textarea label="Mô tả công việc" value={jobForm.description} onChange={(v) => setJobForm({ ...jobForm, description: v })} />
                      <Textarea label="Mô tả EN" value={jobForm.descriptionEn} onChange={(v) => setJobForm({ ...jobForm, descriptionEn: v })} />
                      <Textarea label="Yêu cầu, mỗi dòng một ý" value={jobRequirements} onChange={setJobRequirements} />
                      <Textarea label="Yêu cầu EN, mỗi dòng một ý" value={jobRequirementsEn} onChange={setJobRequirementsEn} />
                      <SaveButton disabled={isSaving} onClick={saveJob} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ── List ── */
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{cmsListTitle(activeTab)}</h2>
                    <p className="mt-0.5 text-sm font-medium text-slate-400">
                      {currentItems.length} mục đang hiển thị
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                    <label className="relative block sm:w-72">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm theo tên hoặc ID…"
                        className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />
                    </label>
                    <button
                      onClick={openCreateForm}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700"
                    >
                      <Plus size={15} />
                      Tạo mới
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <th className="border-b border-slate-100 px-5 py-3">{cmsPrimaryColumn(activeTab)}</th>
                        <th className="border-b border-slate-100 px-5 py-3">Loại</th>
                        {activeTab !== "jobs" && <th className="border-b border-slate-100 px-5 py-3">Hình ảnh</th>}
                        <th className="border-b border-slate-100 px-5 py-3">Trạng thái</th>
                        <th className="border-b border-slate-100 px-5 py-3">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={activeTab === "jobs" ? 4 : 5} className="px-5 py-16 text-center text-sm font-semibold text-slate-400">
                            Chưa có nội dung phù hợp.
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((item) => (
                          <tr key={item.id} className="border-b border-slate-50 align-middle transition hover:bg-slate-50/80">
                            <td className="max-w-[22rem] px-5 py-3">
                              <div className="line-clamp-2 text-sm font-bold text-slate-900">{getItemTitle(item) || "Chưa đặt tên"}</div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                {getItemCategory(item)}
                              </span>
                            </td>
                            {activeTab !== "jobs" && (
                              <td className="px-5 py-3">
                                <ItemThumbnail src={getItemImage(item)} alt={getItemTitle(item)} />
                              </td>
                            )}
                            <td className="px-5 py-3">
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">Hiện</span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => editItem(item.id)}
                                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 transition hover:bg-red-100"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <AdminExtraPanels tab={activeTab} token={session.accessToken} currentUserId={session.user.id} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  const exists = items.some((entry) => entry.id === item.id);
  return exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items];
}

function getItemTitle(item: NewsItem | Project | Job) {
  if ("title" in item) return item.title;
  if ("name" in item) return item.name;
  return "";
}

function getItemCategory(item: NewsItem | Project | Job) {
  if ("category" in item) return item.category;
  if ("type" in item) return item.type;
  return "";
}

function getItemImage(item: NewsItem | Project | Job) {
  if ("thumbnail" in item) return item.thumbnail;
  if ("image" in item) return item.image;
  return "";
}

function cmsListTitle(tab: CmsTab) {
  if (tab === "news") return "Danh sách tin tức";
  if (tab === "projects") return "Danh sách dự án";
  return "Danh sách tuyển dụng";
}

function cmsPrimaryColumn(tab: CmsTab) {
  if (tab === "news") return "Tên chi tiết tin";
  if (tab === "projects") return "Tên dự án";
  return "Vị trí tuyển dụng";
}

function tabTitle(tab: Tab) {
  if (tab === "news") return "Quản lý tin tức";
  if (tab === "projects") return "Quản lý dự án";
  if (tab === "jobs") return "Quản lý tuyển dụng";
  if (tab === "accounts") return "Quản lý tài khoản";
  if (tab === "contacts") return "Thông tin liên hệ";
  if (tab === "applications") return "Hồ sơ ứng tuyển";
  return "Cài đặt website";
}

function isCmsTab(tab: Tab): tab is CmsTab {
  return tab === "news" || tab === "projects" || tab === "jobs";
}

function normalizeProjectGallery(project: Project) {
  return Array.from(new Set([project.image, ...(project.galleryImages ?? [])].map((src) => src.trim()).filter(Boolean)));
}

/* ── UI Components ── */

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SideNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-red-600 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function LoginField({
  icon,
  placeholder,
  value,
  onChange,
  type,
  autoComplete,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="relative block">
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full border border-slate-300 bg-white pl-4 pr-12 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#3f98c4] focus:ring-2 focus:ring-[#3f98c4]/15"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>
    </label>
  );
}

function ItemThumbnail({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return <div className="h-12 w-18 rounded-lg border border-dashed border-slate-200 bg-slate-50" />;
  }
  return (
    <div className="h-12 w-[4.5rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img src={src} alt={alt || "Ảnh nội dung"} className="h-full w-full object-cover" />
    </div>
  );
}

function FormHeader({ title, onDelete }: { title: string; onDelete?: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-[11px] font-black uppercase tracking-widest text-red-500">Biên tập</div>
        <h2 className="mt-0.5 text-xl font-black text-slate-900">{title}</h2>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={15} />
          Xóa
        </button>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MediaSelect({
  label,
  value,
  media,
  token,
  onChange,
  onUploaded,
}: {
  label: string;
  value: string;
  media: MediaRecord[];
  token: string;
  onChange: (value: string) => void;
  onUploaded: (item: MediaRecord) => void;
}) {
  const imageMedia = media.filter((item) => isImageMedia(item));

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</div>
          <p className="mt-1 text-xs font-semibold text-slate-500">Upload ảnh mới từ máy để dùng cho dự án.</p>
        </div>
        <ImageUploadButton token={token} folder="projects" onUploaded={onUploaded} />
      </div>

      {value && (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img src={mediaFileUrl(value)} alt={label} className="h-56 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/95 px-3 text-xs font-black text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
          >
            <Trash2 size={14} />
            Bỏ chọn
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-bold text-white">
            {getMediaLabel(imageMedia, value)}
          </div>
        </div>
      )}

      {!value && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
          Chưa chọn ảnh chính cho dự án.
        </div>
      )}
    </div>
  );
}

function GalleryWithThumbnail({
  label = "Ảnh",
  images,
  thumbnail,
  media,
  token,
  folder,
  onImagesChange,
  onThumbnailChange,
  onUploaded,
}: {
  label?: string;
  images: string[];
  thumbnail: string;
  media: MediaRecord[];
  token: string;
  folder: string;
  onImagesChange: (images: string[]) => void;
  onThumbnailChange: (thumbnail: string) => void;
  onUploaded: (item: MediaRecord) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageMedia = media.filter((m) => isImageMedia(m));
  const validImages = Array.from(new Set(images.filter(Boolean)));
  const isExplicit = !!thumbnail && validImages.includes(thumbnail);
  const effectiveThumb = isExplicit ? thumbnail : validImages[0] ?? "";

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i !== null ? (i - 1 + validImages.length) % validImages.length : null));
  const nextImage = () => setLightboxIndex((i) => (i !== null ? (i + 1) % validImages.length : null));

  const triggerPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    setIsUploading(true);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const item = await uploadMedia(token, file, folder, file.name.replace(/\.[^.]+$/, ""));
        added.push(item.fileUrl);
        onUploaded(item);
      }
      onImagesChange([...validImages, ...added]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Không upload được ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (src: string) => {
    onImagesChange(validImages.filter((u) => u !== src));
    if (thumbnail === src) onThumbnailChange("");
  };

  const pickThumbnail = (src: string) => {
    onThumbnailChange(src === thumbnail ? "" : src);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Nhấn vào khung để chọn ảnh. Nhấn{" "}
          <Star size={11} className="inline-block align-middle" />{" "}
          để đặt ảnh đại diện — mặc định lấy ảnh đầu tiên.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => void uploadFiles(e.target.files)}
      />

      {validImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {validImages.map((src, idx) => {
            const isThumb = src === effectiveThumb;
            const isAutoThumb = isThumb && !isExplicit;
            return (
              <div
                key={src}
                className={`group relative overflow-hidden rounded-xl border-2 bg-white transition-all ${
                  isThumb ? "border-orange-400 shadow-md" : "border-slate-200"
                }`}
              >
                <img
                  src={mediaFileUrl(src)}
                  alt={getMediaLabel(imageMedia, src)}
                  className="h-32 w-full cursor-zoom-in object-cover"
                  onClick={() => openLightbox(idx)}
                />

                <button
                  type="button"
                  onClick={() => pickThumbnail(src)}
                  title={src === thumbnail ? "Bỏ chọn đại diện" : "Đặt làm ảnh đại diện"}
                  className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg shadow-sm transition-all ${
                    isThumb && !isAutoThumb
                      ? "bg-orange-500 text-white"
                      : "bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-orange-100 hover:text-orange-500"
                  }`}
                >
                  <Star size={13} fill={isThumb && !isAutoThumb ? "currentColor" : "none"} />
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(src)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                  aria-label="Xóa ảnh"
                >
                  <Trash2 size={13} />
                </button>

                {isThumb ? (
                  <div className="bg-orange-500 px-2 py-1 text-center text-[10px] font-black uppercase tracking-widest text-white">
                    {isAutoThumb ? "Đại diện (tự động)" : "Đại diện"}
                  </div>
                ) : (
                  <div className="truncate px-2 py-1.5 text-xs font-semibold text-slate-500">
                    {getMediaLabel(imageMedia, src)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more card */}
          <button
            type="button"
            onClick={triggerPicker}
            disabled={isUploading}
            className="flex min-h-[9.5rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <Plus size={22} />
            )}
            <span className="text-xs font-semibold">
              {isUploading ? "Đang tải…" : "Thêm ảnh"}
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white py-12 text-slate-400 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="animate-spin" size={28} />
          ) : (
            <Upload size={28} />
          )}
          <div className="text-center">
            <p className="text-sm font-bold">
              {isUploading ? "Đang tải ảnh lên…" : "Nhấn để chọn ảnh"}
            </p>
            {!isUploading && (
              <p className="mt-0.5 text-xs">Có thể chọn nhiều ảnh cùng lúc</p>
            )}
          </div>
        </button>
      )}

      {uploadError && (
        <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>

          {/* Prev */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <img
            src={mediaFileUrl(validImages[lightboxIndex])}
            alt={getMediaLabel(imageMedia, validImages[lightboxIndex])}
            className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white/80">
            {lightboxIndex + 1} / {validImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageUploadButton({
  token,
  folder,
  onUploaded,
}: {
  token: string;
  folder: string;
  onUploaded: (item: MediaRecord) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const item = await uploadMedia(token, file, folder, file.name.replace(/\.[^.]+$/, ""));
        onUploaded(item);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không upload được ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800">
        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        {isUploading ? "Đang upload..." : "Chọn ảnh từ máy"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(event) => void uploadFiles(event.target.files)}
        />
      </label>
      {error && <div className="mt-2 text-xs font-semibold text-red-600">{error}</div>}
    </div>
  );
}

function SelectedMediaCard({ src, label, onRemove }: { src: string; label: string; onRemove: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      <img src={mediaFileUrl(src)} alt={label} className="h-32 w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 opacity-100 shadow-sm transition hover:bg-red-600 hover:text-white md:opacity-0 md:group-hover:opacity-100"
        aria-label="Bỏ ảnh khỏi gallery"
      >
        <Trash2 size={14} />
      </button>
      <div className="truncate px-3 py-2 text-xs font-bold text-slate-600">{label}</div>
    </div>
  );
}

function getMediaLabel(media: MediaRecord[], src: string) {
  return media.find((item) => item.fileUrl === src)?.fileName ?? src.split("/").pop() ?? "Ảnh dự án";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Không đọc được file."));
    reader.readAsDataURL(file);
  });
}

function isImageMedia(item: MediaRecord) {
  return item.fileType === "image" || /\.(png|jpe?g|webp|gif|avif)$/i.test(item.fileUrl);
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

function SaveButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {disabled ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
      {disabled ? "Đang lưu…" : "Lưu nội dung"}
    </button>
  );
}
