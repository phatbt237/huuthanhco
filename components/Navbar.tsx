"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Menu, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type NavItem = {
  href: string;
  label: string;
  children?: {
    href: string;
    label: string;
  }[];
};

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenItems, setMobileOpenItems] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const closeTimerRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks: NavItem[] = [
    { href: "/", label: t("Trang chủ", "Home") },
    {
      href: "/gioi-thieu",
      label: t("Giới thiệu", "About"),
      children: [
        { href: "/gioi-thieu", label: t("Tổng quan", "Overview") },
        { href: "/gioi-thieu#lich-su", label: t("Lịch sử", "History") },
        { href: "/gioi-thieu#su-menh-tam-nhin", label: t("Sứ mệnh - Tầm nhìn", "Mission - Vision") },
        { href: "/gioi-thieu#gia-tri-cot-loi", label: t("Giá trị cốt lõi", "Core Values") },
        { href: "/gioi-thieu#so-do-to-chuc", label: t("Sơ đồ tổ chức", "Organization Chart") },
        { href: "/gioi-thieu#ho-so-nang-luc", label: t("Hồ sơ năng lực", "Company Profile") },
      ],
    },
    {
      href: "/du-an",
      label: t("Dự án tiêu biểu", "Projects"),
      children: [
        { label: t("Tất cả dự án", "All Projects"), href: "/du-an" },
        { label: t("Cầu đường", "Roads & Bridges"), href: "/du-an?loai=cau-duong" },
        { label: t("Cảng biển", "Ports & Harbors"), href: "/du-an?loai=cang-bien" },
        { label: t("Thủy lợi", "Hydraulics"), href: "/du-an?loai=thuy-loi" },
        { label: t("Nạo vét", "Dredging"), href: "/du-an?loai=nao-vet" },
      ],
    },
    {
      href: "/thiet-bi",
      label: t("Thiết bị", "Equipment"),
      children: [
        { href: "/thiet-bi", label: t("Tất cả thiết bị", "All Equipment") },
        { href: "/thiet-bi#thiet-bi-1", label: t("Sà lan vận chuyển", "Transport Barges") },
        { href: "/thiet-bi#thiet-bi-2", label: t("Cẩu nổi", "Floating Cranes") },
        { href: "/thiet-bi#thiet-bi-3", label: t("Máy ép cọc thủy lực", "Hydraulic Pile Press") },
        { href: "/thiet-bi#thiet-bi-4", label: t("Tàu nạo vét", "Dredgers") },
      ],
    },
    { href: "/tin-tuc", label: t("Tin tức", "News") },
    { href: "/tuyen-dung", label: t("Tuyển dụng", "Careers") },
    { href: "/lien-he", label: t("Liên hệ", "Contact") },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    setDesktopMenuOpen(null);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;

    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  const openDesktopMenu = (href: string) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setDesktopMenuOpen(href);
  };

  const closeDesktopMenu = () => {
    closeTimerRef.current = window.setTimeout(() => {
      setDesktopMenuOpen(null);
      closeTimerRef.current = null;
    }, 120);
  };

  const toggleMobileItem = (href: string) => {
    setMobileOpenItems((current) => ({ ...current, [href]: !current[href] }));
  };

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
  };

  const LangToggle = () => (
    <div className="flex h-full items-stretch overflow-hidden border-l border-slate-200 text-sm font-bold">
      <button
        onClick={() => setLang("vi")}
        className={`px-4 transition-colors ${lang === "vi" ? "bg-orange-500 text-white" : "bg-white text-slate-500 hover:text-orange-500"}`}
      >
        VI
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-4 transition-colors ${lang === "en" ? "bg-orange-500 text-white" : "bg-white text-slate-500 hover:text-orange-500"}`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-48 items-center gap-3 pr-6">
            <img
              src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/69ba7546394f41773827398.jpg"
              alt="Logo Hữu Thành"
              className="h-11 w-11 rounded object-contain"
            />
            <div>
              <div className="text-lg font-bold leading-tight text-orange-500">Hữu Thành</div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Construction</div>
            </div>
          </Link>

          <nav className="hidden items-stretch lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative flex"
                onMouseEnter={() => link.children && openDesktopMenu(link.href)}
                onMouseLeave={closeDesktopMenu}
                onFocus={() => link.children && openDesktopMenu(link.href)}
                onBlur={closeDesktopMenu}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 border-l border-slate-100 px-4 text-sm font-semibold transition-colors xl:px-5 ${
                    isActive(link.href) || desktopMenuOpen === link.href
                      ? "bg-orange-500 text-white"
                      : "text-slate-700 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${desktopMenuOpen === link.href ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {link.children && desktopMenuOpen === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute left-0 top-full w-72 bg-white py-2 shadow-xl ring-1 ring-slate-200"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDesktopMenuOpen(null)}
                          className="block px-8 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-500"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="hidden items-stretch lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-16 items-center justify-center border-l border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-500"
              aria-label={t("Tìm kiếm", "Search")}
            >
              <Search size={20} />
            </button>
            <Link
              href="/lien-he"
              className="flex w-16 items-center justify-center border-l border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-500"
              aria-label={t("Liên hệ", "Contact")}
            >
              <Mail size={20} />
            </Link>
            <LangToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="p-2 text-slate-900"
              onClick={() => setSearchOpen(true)}
              aria-label={t("Tìm kiếm", "Search")}
            >
              <Search size={23} />
            </button>
            <button
              className="p-2 text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-slate-100 bg-white lg:hidden"
          >
            <nav className="flex flex-col px-4 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.children ? (
                    <>
                      <button
                        onClick={() => toggleMobileItem(link.href)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${
                          isActive(link.href) ? "text-orange-500" : "text-slate-700 hover:text-orange-500"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${mobileOpenItems[link.href] ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileOpenItems[link.href] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 px-8 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-500"
                              >
                                <span className="h-1 w-1 shrink-0 rounded-full bg-orange-500" />
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive(link.href)
                          ? "text-orange-500"
                          : "text-slate-700 hover:text-orange-500"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="mt-3 flex h-11 border border-slate-200">
                <LangToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-4 top-full z-[80] mt-3 w-[calc(100vw-2rem)] max-w-md bg-white p-3 shadow-2xl ring-1 ring-slate-200 lg:right-20"
          >
            <div className="absolute -top-2 right-12 h-4 w-4 rotate-45 bg-white ring-1 ring-slate-200" />
            <form
              className="relative flex items-center bg-slate-100"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
            >
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Tìm kiếm ...", "Search ...")}
                className="h-14 min-w-0 flex-1 bg-transparent px-5 text-base text-slate-900 outline-none placeholder:text-slate-500"
                />
                <button
                type="submit"
                className="flex h-14 w-14 shrink-0 items-center justify-center text-slate-600 transition-colors hover:text-orange-500"
                aria-label={t("Tìm kiếm", "Search")}
                >
                <Search size={22} />
                </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
