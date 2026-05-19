"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Lock,
  Mail,
  Inbox,
  Loader2,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
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
    .replace(/[\u0300-\u036f]/g, "")
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
      <section className="min-h-screen bg-slate-950 pt-20">
        <div className="flex min-h-[60vh] items-center justify-center text-white">
          <Loader2 className="mr-3 animate-spin" size={20} />
          Đang kiểm tra phiên đăng nhập
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="min-h-screen bg-slate-950">
        <div className="flex min-h-screen items-center justify-center text-white">
          <Loader2 className="mr-3 animate-spin" size={20} />
          Đang chuyển đến trang đăng nhập
        </div>
      </section>
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
      <section className="min-h-screen bg-slate-950">
        <div className="flex min-h-screen items-center justify-center text-white">
          <Loader2 className="mr-3 animate-spin" size={20} />
          Đang kiểm tra phiên đăng nhập
        </div>
      </section>
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
            <div className="text-3xl font-black tracking-tight text-cyan-200">Hữu Thành CMS</div>
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

  return (
    <section className="min-h-screen bg-slate-100 text-slate-950">
      <div className="bg-[#d60000] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 text-sm font-bold">
          <div>
            <span>Xin chào:</span>
            <span className="ml-2">{session.user.fullName || session.user.email}</span>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-1 underline">
          <LogOut size={14} />
          Thoát
          </button>
        </div>
      </div>

      <nav className="border-b-4 border-white bg-[#d60000]">
        <div className="flex overflow-x-auto">
          <AdminTabButton active={activeTab === "accounts"} label="Quản Trị Tài khoản" onClick={() => changeTab("accounts")} />
          <AdminTabButton label="Keyword" onClick={() => showStatus("Chức năng Keyword sẽ được kết nối sau.")} />
          <AdminTabButton label="WebMail" onClick={() => showStatus("Chức năng WebMail sẽ được kết nối sau.")} />
          <AdminTabButton label="Banner" onClick={() => showStatus("Chức năng Banner sẽ được kết nối sau.")} />
          <AdminTabButton label="Flash" onClick={() => showStatus("Chức năng Flash sẽ được kết nối sau.")} />
          <AdminTabButton active={activeTab === "news"} label="Đăng tin" onClick={() => changeTab("news")} />
          <AdminTabButton active={activeTab === "projects"} label="Dự án" onClick={() => changeTab("projects")} />
          <AdminTabButton active={activeTab === "jobs"} label="Tuyển dụng" onClick={() => changeTab("jobs")} />
          <AdminTabButton active={activeTab === "contacts"} label="Hộp thư" onClick={() => changeTab("contacts")} />
          <AdminTabButton active={activeTab === "applications"} label="Ứng tuyển" onClick={() => changeTab("applications")} />
          <AdminTabButton active={activeTab === "settings"} label="Thông Tin Liên Hệ" onClick={() => changeTab("settings")} />
        </div>
      </nav>

      <main className="mx-auto mt-6 max-w-[1400px] bg-white px-7 py-8 shadow-sm">
          <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-base font-bold text-slate-900">{tabTitle(activeTab)}</div>
              {isCmsTab(activeTab) && !isEditorOpen && (
                <p className="mt-2 text-sm text-slate-500">
                  Hiển thị danh sách trước. Bấm Tạo mới hoặc Sửa khi cần biên tập nội dung.
                </p>
              )}
            </div>
            {isCmsTab(activeTab) && (
              <div className="flex flex-wrap gap-2">
                <button onClick={openCreateForm} className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
                  <Plus size={15} />
                  Tạo mới
                </button>
                <button onClick={exportJson} className="inline-flex h-10 items-center gap-2 border border-slate-400 bg-slate-100 px-3 text-sm font-bold text-slate-800">
                  <Download size={15} />
                  Export
                </button>
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-slate-400 bg-slate-100 px-3 text-sm font-bold text-slate-800">
                  <Upload size={15} />
                  Import
                  <input type="file" accept="application/json" className="hidden" onChange={(event) => importJson(event.target.files?.[0] ?? null)} />
                </label>
                <button onClick={clearAll} className="inline-flex h-10 items-center gap-2 border border-red-300 bg-white px-3 text-sm font-bold text-red-700">
                  <Trash2 size={15} />
                  Xóa CMS
                </button>
              </div>
            )}
          </header>

          {statusMessage && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm font-semibold ${
                statusKind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {statusKind === "error" ? <AlertCircle className="mt-0.5 shrink-0" size={18} /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} />}
              {statusMessage}
            </div>
          )}

          {isCmsTab(activeTab) ? (
            isEditorOpen ? (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                      {editingId ? "Chỉnh sửa nội dung" : "Tạo nội dung mới"}
                    </div>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">{tabTitle(activeTab)}</h2>
                  </div>
                  <button onClick={resetForm} className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50">
                    Quay lại danh sách
                  </button>
                </div>
                <div className="p-5">
              {activeTab === "news" && (
                <div className="space-y-4">
                  <FormHeader title="Tin tức" onDelete={newsForm.id ? () => removeItem(newsForm.id) : undefined} />
                  <Input label="Tiêu đề" value={newsForm.title} onChange={(value) => setNewsForm({ ...newsForm, title: value, slug: newsForm.slug || slugify(value) })} />
                  <Input label="Tiêu đề EN" value={newsForm.titleEn} onChange={(value) => setNewsForm({ ...newsForm, titleEn: value })} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Input label="Slug" value={newsForm.slug} onChange={(value) => setNewsForm({ ...newsForm, slug: slugify(value) })} />
                    <Input label="Ngày" type="date" value={newsForm.date} onChange={(value) => setNewsForm({ ...newsForm, date: value })} />
                    <Input label="Danh mục" value={newsForm.category} onChange={(value) => setNewsForm({ ...newsForm, category: value })} />
                    <Input label="Danh mục EN" value={newsForm.categoryEn} onChange={(value) => setNewsForm({ ...newsForm, categoryEn: value })} />
                  </div>
                  <Input label="Ảnh đại diện" value={newsForm.thumbnail} onChange={(value) => setNewsForm({ ...newsForm, thumbnail: value })} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Textarea label="Mô tả ngắn (VI)" value={newsForm.excerpt} onChange={(value) => setNewsForm({ ...newsForm, excerpt: value })} />
                    <Textarea label="Mô tả ngắn (EN)" value={newsForm.excerptEn} onChange={(value) => setNewsForm({ ...newsForm, excerptEn: value })} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Textarea label="Nội dung (VI)" rows={8} value={newsForm.content} onChange={(value) => setNewsForm({ ...newsForm, content: value })} />
                    <Textarea label="Nội dung (EN)" rows={8} value={newsForm.contentEn} onChange={(value) => setNewsForm({ ...newsForm, contentEn: value })} />
                  </div>
                  <SaveButton disabled={isSaving} onClick={saveNews} />
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-4">
                  <FormHeader title="Dự án" onDelete={projectForm.id ? () => removeItem(projectForm.id) : undefined} />
                  <Input label="Tên dự án" value={projectForm.name} onChange={(value) => setProjectForm({ ...projectForm, name: value })} />
                  <Input label="Tên dự án EN" value={projectForm.nameEn} onChange={(value) => setProjectForm({ ...projectForm, nameEn: value })} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input label="Địa điểm" value={projectForm.location} onChange={(value) => setProjectForm({ ...projectForm, location: value })} />
                    <Input label="Năm" type="number" value={String(projectForm.year)} onChange={(value) => setProjectForm({ ...projectForm, year: Number(value) })} />
                    <Input label="Loại" value={projectForm.category} onChange={(value) => setProjectForm({ ...projectForm, category: value })} />
                  </div>
                  <Input label="Ảnh dự án" value={projectForm.image} onChange={(value) => setProjectForm({ ...projectForm, image: value })} />
                  <Textarea label="Mô tả" value={projectForm.description} onChange={(value) => setProjectForm({ ...projectForm, description: value })} />
                  <Textarea label="Mô tả EN" value={projectForm.descriptionEn} onChange={(value) => setProjectForm({ ...projectForm, descriptionEn: value })} />
                  <SaveButton disabled={isSaving} onClick={saveProject} />
                </div>
              )}

              {activeTab === "jobs" && (
                <div className="space-y-4">
                  <FormHeader title="Tuyển dụng" onDelete={jobForm.id ? () => removeItem(jobForm.id) : undefined} />
                  <Input label="Vị trí" value={jobForm.title} onChange={(value) => setJobForm({ ...jobForm, title: value })} />
                  <Input label="Vị trí EN" value={jobForm.titleEn} onChange={(value) => setJobForm({ ...jobForm, titleEn: value })} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input label="Địa điểm" value={jobForm.location} onChange={(value) => setJobForm({ ...jobForm, location: value })} />
                    <Input label="Loại hình" value={jobForm.type} onChange={(value) => setJobForm({ ...jobForm, type: value })} />
                    <Input label="Lương" value={jobForm.salary} onChange={(value) => setJobForm({ ...jobForm, salary: value })} />
                  </div>
                  <Textarea label="Mô tả công việc" value={jobForm.description} onChange={(value) => setJobForm({ ...jobForm, description: value })} />
                  <Textarea label="Mô tả EN" value={jobForm.descriptionEn} onChange={(value) => setJobForm({ ...jobForm, descriptionEn: value })} />
                  <Textarea label="Yêu cầu, mỗi dòng một ý" value={jobRequirements} onChange={setJobRequirements} />
                  <Textarea label="Yêu cầu EN, mỗi dòng một ý" value={jobRequirementsEn} onChange={setJobRequirementsEn} />
                  <SaveButton disabled={isSaving} onClick={saveJob} />
                </div>
              )}
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">{cmsListTitle(activeTab)}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {currentItems.length} nội dung đang hiển thị trong danh sách.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <label className="relative block min-w-0 sm:w-80">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm theo tên hoặc ID"
                        className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </label>
                    <button onClick={openCreateForm} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
                      <Plus size={16} />
                      Tạo mới
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="w-36 border-b border-slate-200 px-4 py-3">Thao tác</th>
                        <th className="border-b border-slate-200 px-4 py-3">{cmsPrimaryColumn(activeTab)}</th>
                        <th className="border-b border-slate-200 px-4 py-3">Loại</th>
                        <th className="border-b border-slate-200 px-4 py-3">Hình ảnh</th>
                        <th className="border-b border-slate-200 px-4 py-3">Hiển thị</th>
                        <th className="border-b border-slate-200 px-4 py-3">Ngôn ngữ</th>
                        <th className="border-b border-slate-200 px-4 py-3">{activeTab === "projects" ? "Năm" : "ID"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-sm font-semibold text-slate-400">
                            Chưa có nội dung phù hợp.
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((item) => (
                          <tr key={item.id} className="border-b border-slate-100 align-middle hover:bg-orange-50/30">
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button onClick={() => editItem(item.id)} className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-black text-blue-700 hover:bg-blue-100">
                                  Sửa
                                </button>
                                <button onClick={() => removeItem(item.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-700 hover:bg-red-100">
                                  Xóa
                                </button>
                              </div>
                            </td>
                            <td className="max-w-[24rem] px-4 py-4">
                              <div className="line-clamp-2 text-base font-black text-slate-900">{getItemTitle(item) || "Chưa đặt tên"}</div>
                              <div className="mt-1 truncate text-xs font-semibold text-slate-400">{item.id}</div>
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-600">{getItemCategory(item)}</td>
                            <td className="px-4 py-4">
                              <ItemThumbnail src={getItemImage(item)} alt={getItemTitle(item)} />
                            </td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Enable</span>
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-600">VI / EN</td>
                            <td className="px-4 py-4 font-semibold text-slate-600">{activeTab === "projects" && "year" in item ? item.year : item.id}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          ) : (
            <AdminExtraPanels tab={activeTab} token={session.accessToken} currentUserId={session.user.id} />
          )}
      </main>
    </section>
  );
}

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
  return "Cấu hình website";
}

function isCmsTab(tab: Tab): tab is CmsTab {
  return tab === "news" || tab === "projects" || tab === "jobs";
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
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-slate-300 bg-white pl-4 pr-12 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#3f98c4] focus:ring-2 focus:ring-[#3f98c4]/15"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>
    </label>
  );
}

function AdminTabButton({ active = false, label, onClick }: { active?: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-14 shrink-0 border-r border-red-700 px-5 text-base font-bold transition-colors ${
        active ? "bg-white text-red-600" : "bg-[#d60000] text-white hover:bg-red-700"
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function ItemThumbnail({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return <div className="h-16 w-24 rounded-lg border border-dashed border-slate-200 bg-slate-50" />;
  }

  return (
    <div className="h-16 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img src={src} alt={alt || "Ảnh nội dung"} className="h-full w-full object-cover" />
    </div>
  );
}

function FormHeader({ title, onDelete }: { title: string; onDelete?: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Biên tập</div>
        <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
      </div>
      {onDelete && (
        <button onClick={onDelete} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-black text-red-600">
          <Trash2 size={16} />
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
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function SaveButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {disabled ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
      {disabled ? "Đang lưu..." : "Lưu nội dung"}
    </button>
  );
}
