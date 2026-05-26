"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FolderOpen,
  Inbox,
  Lock,
  Eye,
  Loader2,
  LogOut,
  Mail,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import AdminExtraPanels, { type ExtraAdminTab } from "@/components/AdminExtraPanels";
import {
  ItemThumbnail,
  LoginField,
  NavSection,
  SideNavItem,
} from "@/components/admin/AdminCmsUi";
import JobEditorForm from "@/components/admin/JobEditorForm";
import NewsEditorForm from "@/components/admin/NewsEditorForm";
import ProjectEditorForm from "@/components/admin/ProjectEditorForm";
import { canAccess, canDelete, canWrite, defaultTab } from "@/lib/permissions";
import type { Job } from "@/data/jobs";
import type { NewsItem } from "@/data/news";
import type { Project } from "@/data/projects";
import { fetchCmsContent, type CmsContent } from "@/lib/cmsContent";
import {
  getStoredAdminSession,
  loginAdmin,
  logoutAdmin,
  validateAdminSession,
  type AdminUser,
} from "@/lib/adminAuth";
import {
  createJob,
  createNews,
  createProject,
  deleteJob,
  deleteNews,
  deleteProject,
  listMedia,
  updateJob,
  updateNews,
  updateProject,
  type MediaRecord,
} from "@/lib/siteApi";

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
                src="/images/huu-thanh-logo.png"
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
  const role = session.user.role;
  const [content, setContent] = useState<CmsContent>({ news: [], projects: [], jobs: [] });
  const [activeTab, setActiveTab] = useState<Tab>(() => defaultTab(role) as Tab);
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

  const mutateContent = async (action: () => Promise<unknown>, successMessage: string) => {
    setIsSaving(true);
    setStatusMessage("");
    try {
      await action();
      setContent(await fetchCmsContent());
      showStatus(successMessage);
      resetForm();
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Không lưu được dữ liệu.", "error");
    } finally {
      setIsSaving(false);
    }
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
    if (activeTab === "news") {
      void mutateContent(() => deleteNews(session.accessToken, id), "Đã xóa tin tức.");
    } else if (activeTab === "projects") {
      void mutateContent(() => deleteProject(session.accessToken, id), "Đã xóa dự án.");
    } else if (activeTab === "jobs") {
      void mutateContent(() => deleteJob(session.accessToken, id), "Đã xóa vị trí tuyển dụng.");
    }
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
    await mutateContent(
      () => (newsForm.id
        ? updateNews(session.accessToken, item.id, item)
        : createNews(session.accessToken, item)),
      "Đã lưu tin tức.",
    );
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
    await mutateContent(
      () => (projectForm.id
        ? updateProject(session.accessToken, item.id, item)
        : createProject(session.accessToken, item)),
      "Đã lưu dự án.",
    );
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

    await mutateContent(
      () => (jobForm.id
        ? updateJob(session.accessToken, item.id, item)
        : createJob(session.accessToken, item)),
      "Đã lưu vị trí tuyển dụng.",
    );
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
              src="/images/huu-thanh-logo.png"
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
          {(canAccess(role, "projects") || canAccess(role, "news") || canAccess(role, "jobs")) && (
            <NavSection label="Nội dung">
              {canAccess(role, "projects") && <SideNavItem icon={<FolderOpen size={16} />} label="Dự án" active={activeTab === "projects"} onClick={() => changeTab("projects")} />}
              {canAccess(role, "news") && <SideNavItem icon={<Newspaper size={16} />} label="Tin tức" active={activeTab === "news"} onClick={() => changeTab("news")} />}
              {canAccess(role, "jobs") && <SideNavItem icon={<Briefcase size={16} />} label="Tuyển dụng" active={activeTab === "jobs"} onClick={() => changeTab("jobs")} />}
            </NavSection>
          )}
          {(canAccess(role, "contacts") || canAccess(role, "applications")) && (
            <NavSection label="Liên hệ">
              {canAccess(role, "contacts") && <SideNavItem icon={<Inbox size={16} />} label="Hộp thư" active={activeTab === "contacts"} onClick={() => changeTab("contacts")} />}
              {canAccess(role, "applications") && <SideNavItem icon={<UserCheck size={16} />} label="Ứng tuyển" active={activeTab === "applications"} onClick={() => changeTab("applications")} />}
            </NavSection>
          )}
          {(canAccess(role, "accounts") || canAccess(role, "settings")) && (
            <NavSection label="Hệ thống">
              {canAccess(role, "accounts") && <SideNavItem icon={<Users size={16} />} label="Tài khoản" active={activeTab === "accounts"} onClick={() => changeTab("accounts")} />}
              {canAccess(role, "settings") && <SideNavItem icon={<Settings size={16} />} label="Cài đặt" active={activeTab === "settings"} onClick={() => changeTab("settings")} />}
            </NavSection>
          )}
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
                    <NewsEditorForm
                      value={newsForm}
                      media={mediaLibrary}
                      token={session.accessToken}
                      isSaving={isSaving}
                      onChange={setNewsForm}
                      onTitleChange={(title) => setNewsForm({ ...newsForm, title, slug: newsForm.slug || slugify(title) })}
                      onSlugChange={(slug) => setNewsForm({ ...newsForm, slug: slugify(slug) })}
                      onUploaded={(item) => setMediaLibrary((previous) => [item, ...previous.filter((entry) => entry.id !== item.id)])}
                      onDelete={newsForm.id && canDelete(role, "news") ? () => removeItem(newsForm.id) : undefined}
                      onSave={saveNews}
                    />
                  )}

                  {activeTab === "projects" && (
                    <ProjectEditorForm
                      value={projectForm}
                      media={mediaLibrary}
                      token={session.accessToken}
                      isSaving={isSaving}
                      onChange={setProjectForm}
                      onUploaded={(item) => setMediaLibrary((previous) => [item, ...previous.filter((entry) => entry.id !== item.id)])}
                      onDelete={projectForm.id && canDelete(role, "projects") ? () => removeItem(projectForm.id) : undefined}
                      onSave={saveProject}
                    />
                  )}

                  {activeTab === "jobs" && (
                    <JobEditorForm
                      value={jobForm}
                      requirements={jobRequirements}
                      requirementsEn={jobRequirementsEn}
                      isSaving={isSaving}
                      onChange={setJobForm}
                      onRequirementsChange={setJobRequirements}
                      onRequirementsEnChange={setJobRequirementsEn}
                      onDelete={jobForm.id && canDelete(role, "jobs") ? () => removeItem(jobForm.id) : undefined}
                      onSave={saveJob}
                    />
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
                    {canWrite(role, activeTab) && (
                      <button
                        onClick={openCreateForm}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700"
                      >
                        <Plus size={15} />
                        Tạo mới
                      </button>
                    )}
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
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                                <Eye size={11} />
                                Hiện
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex gap-1.5">
                                {canWrite(role, activeTab) && (
                                  <button
                                    onClick={() => editItem(item.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                                  >
                                    <Pencil size={12} />
                                    Sửa
                                  </button>
                                )}
                                {canDelete(role, activeTab) && (
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 transition hover:bg-red-100"
                                  >
                                    <Trash2 size={12} />
                                    Xóa
                                  </button>
                                )}
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
            <AdminExtraPanels tab={activeTab} token={session.accessToken} currentUserId={session.user.id} role={session.user.role} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Helpers ── */

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
