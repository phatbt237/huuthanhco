"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
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
  Trash2,
  Upload,
  UserCheck,
  Users,
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

type CmsTab = "news" | "projects" | "jobs";
type Tab = CmsTab | ExtraAdminTab;
type Session = {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

const blankNews: NewsItem = {
  id: "",
  title: "",
  titleEn: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Tin tức",
  categoryEn: "News",
  thumbnail: "/images/du-an/huu-thanh-co_132827983464005202.jpg",
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
  image: "/images/du-an/huu-thanh-co_132827983464005202.jpg",
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

  useEffect(() => {
    void fetchCmsContent().then(setContent);
  }, []);

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
      if (item) setNewsForm(item);
    }
    if (activeTab === "projects") {
      const item = content.projects.find((entry) => entry.id === id);
      if (item) setProjectForm(item);
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
    const item: NewsItem = {
      ...newsForm,
      id: newsForm.id || nextId("news"),
      slug: newsForm.slug || slugify(newsForm.title),
      titleEn: newsForm.titleEn || newsForm.title,
      categoryEn: newsForm.categoryEn || newsForm.category,
      excerptEn: newsForm.excerptEn || newsForm.excerpt,
      contentEn: newsForm.contentEn || newsForm.content,
    };
    await persist({ ...content, news: upsert(content.news, item) });
    resetForm();
  };

  const saveProject = async () => {
    const item: Project = {
      ...projectForm,
      id: projectForm.id || nextId("project"),
      year: Number(projectForm.year) || new Date().getFullYear(),
      nameEn: projectForm.nameEn || projectForm.name,
      categoryEn: projectForm.categoryEn || projectForm.category,
      descriptionEn: projectForm.descriptionEn || projectForm.description,
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

            {isCmsTab(activeTab) && (
              <button
                onClick={openCreateForm}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-xs font-black text-white transition hover:bg-red-700"
              >
                <Plus size={14} />
                Tạo mới
              </button>
            )}
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
                      <Input label="Ảnh đại diện" value={newsForm.thumbnail} onChange={(v) => setNewsForm({ ...newsForm, thumbnail: v })} />
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
                        <Input label="Địa điểm" value={projectForm.location} onChange={(v) => setProjectForm({ ...projectForm, location: v })} />
                        <Input label="Năm" type="number" value={String(projectForm.year)} onChange={(v) => setProjectForm({ ...projectForm, year: Number(v) })} />
                        <Input label="Loại" value={projectForm.category} onChange={(v) => setProjectForm({ ...projectForm, category: v })} />
                      </div>
                      <Input label="Ảnh dự án" value={projectForm.image} onChange={(v) => setProjectForm({ ...projectForm, image: v })} />
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
                  <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <th className="border-b border-slate-100 px-5 py-3">{cmsPrimaryColumn(activeTab)}</th>
                        <th className="border-b border-slate-100 px-5 py-3">Loại</th>
                        <th className="border-b border-slate-100 px-5 py-3">Hình ảnh</th>
                        <th className="border-b border-slate-100 px-5 py-3">Trạng thái</th>
                        <th className="border-b border-slate-100 px-5 py-3">Ngôn ngữ</th>
                        {activeTab === "projects" && <th className="border-b border-slate-100 px-5 py-3">Năm</th>}
                        <th className="border-b border-slate-100 px-5 py-3">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={activeTab === "projects" ? 7 : 6} className="px-5 py-16 text-center text-sm font-semibold text-slate-400">
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
                            <td className="px-5 py-3">
                              <ItemThumbnail src={getItemImage(item)} alt={getItemTitle(item)} />
                            </td>
                            <td className="px-5 py-3">
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">Hiện</span>
                            </td>
                            <td className="px-5 py-3 text-xs font-semibold text-slate-500">VI / EN</td>
                            {activeTab === "projects" && "year" in item && (
                              <td className="px-5 py-3 text-sm font-semibold text-slate-600">{item.year}</td>
                            )}
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
