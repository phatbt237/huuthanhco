"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { isDark, setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenItems, setMobileOpenItems] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const navLinks = [
    { href: "/", label: t("Trang chủ", "Home") },
    {
      href: "/gioi-thieu",
      label: t("Giới thiệu", "About"),
      children: [
        { label: t("Tổng quan", "Overview"), href: "/gioi-thieu" },
        { label: t("Tầm nhìn & Sứ mệnh", "Vision & Mission"), href: "/gioi-thieu#tam-nhin-su-menh" },
        { label: t("Giá trị cốt lõi", "Core Values"), href: "/gioi-thieu#gia-tri-cot-loi" },
        { label: t("Hành trình phát triển", "Our Journey"), href: "/gioi-thieu#hanh-trinh" },
      ],
    },
    {
      href: "/du-an",
      label: t("Dự án", "Projects"),
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
        { label: t("Tất cả thiết bị", "All Equipment"), href: "/thiet-bi" },
        { label: t("Phương tiện thủy", "Marine Vessels"), href: "/thiet-bi?loai=phuong-tien-thuy" },
        { label: t("Máy móc thi công", "Construction Machinery"), href: "/thiet-bi?loai=may-moc" },
        { label: t("Thiết bị đo lường", "Survey Equipment"), href: "/thiet-bi?loai=do-luong" },
      ],
    },
    { href: "/tin-tuc", label: t("Tin tức", "News") },
    { href: "/tuyen-dung", label: t("Tuyển dụng", "Careers") },
    { href: "/lien-he", label: t("Liên hệ", "Contact") },
  ];

  const desktopLinks = navLinks.filter((l) => l.href !== "/lien-he");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileOpenItems(new Set());
    setOpenDropdown(null);
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

  const toggleMobileItem = (href: string) => {
    setMobileOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  };

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
  };

  const LangToggle = ({ small }: { small?: boolean }) => (
    <div
      className={`flex items-center border border-white/20 rounded overflow-hidden font-bold text-xs ${
        small ? "h-8" : "h-10"
      }`}
      role="group"
      aria-label={t("Chọn ngôn ngữ", "Select language")}
    >
      <button
        type="button"
        onClick={() => setLang("vi")}
        className={`h-full px-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 ${
          lang === "vi" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
        }`}
        aria-pressed={lang === "vi"}
        aria-label="Tiếng Việt"
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`h-full px-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 ${
          lang === "en" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
        }`}
        aria-pressed={lang === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled || !isHome ? "#0D1B2A" : "transparent",
        boxShadow: isScrolled || !isHome ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/huu-thanh-logo.png"
              alt="Logo Hữu Thành"
              className="w-10 h-10 object-contain rounded"
            />
            <div>
              <div className="text-red-500 font-bold text-lg leading-tight">Hữu Thành</div>
              <div className="text-red-500 text-xs tracking-widest uppercase">Construction</div>
            </div>
          </Link>

          {/* Desktop Nav — hiển thị trực tiếp trên header */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label={t("Điều hướng chính", "Main navigation")}>
            {desktopLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === link.href ? null : link.href);
                      } else if (e.key === "Escape") {
                        setOpenDropdown(null);
                      }
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      pathname.startsWith(link.href) && link.href !== "/"
                        ? "text-orange-400"
                        : "text-white/80 hover:text-white"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === link.href}
                    aria-label={link.label}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openDropdown === link.href ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-1 w-52 rounded-xl overflow-hidden"
                        style={{
                          backgroundColor: "#0D1B2A",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                        }}
                        role="menu"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-3 text-sm text-white/70 hover:text-orange-400 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                            role="menuitem"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    pathname === link.href
                      ? "text-orange-400"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white/75 transition-colors duration-200 hover:border-orange-400/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label={t("Tìm kiếm", "Search")}
            >
              <Search size={19} />
            </button>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white/75 transition-colors duration-200 hover:border-orange-400/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label={t(isDark ? "Chế độ sáng" : "Chế độ tối", isDark ? "Light mode" : "Dark mode")}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <LangToggle />
            <Link
              href="/lien-he"
              className="h-10 flex items-center bg-orange-500 hover:bg-orange-600 text-white px-5 rounded text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              {t("Liên hệ ngay", "Contact Us")}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={t("Tìm kiếm", "Search")}
            >
              <Search size={22} />
            </button>
            <button
              type="button"
              className="p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={t(isDark ? "Chế độ sáng" : "Chế độ tối", isDark ? "Light mode" : "Dark mode")}
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <LangToggle small />
            <button
              type="button"
              className="text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t("Mở menu", "Open menu")}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: "#0D1B2A" }}
            id="mobile-menu"
            role="navigation"
            aria-label={t("Điều hướng di động", "Mobile navigation")}
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.children ? (
                    <>
                      <div className="flex items-center rounded text-white/80 transition-colors hover:bg-white/5 hover:text-white">
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-3 pl-4 pr-2 text-sm font-medium"
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileItem(link.href)}
                          className="flex h-11 w-12 items-center justify-center"
                          aria-label={t("Mở menu con", "Open submenu")}
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              mobileOpenItems.has(link.href) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileOpenItems.has(link.href) && (
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
                                className="block rounded py-2.5 pl-8 pr-4 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-orange-400"
                              >
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
                      className={`block py-3 px-4 rounded text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "text-orange-400 bg-white/5"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
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
            className="absolute right-4 top-full z-[80] mt-3 w-[calc(100vw-2rem)] max-w-md bg-white p-3 shadow-2xl ring-1 ring-slate-200 lg:right-8"
          >
            <div className="absolute -top-2 right-16 h-4 w-4 rotate-45 bg-white ring-1 ring-slate-200" />
            <form
              className="relative flex items-center bg-slate-100"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Tìm kiếm dự án, thiết bị, tin tức ...", "Search projects, equipment, news ...")}
                className="h-14 min-w-0 flex-1 bg-transparent px-5 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                aria-label={t("Tìm kiếm", "Search")}
              />
              <button
                type="submit"
                className="flex h-14 w-14 shrink-0 items-center justify-center text-slate-600 transition-colors hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label={t("Gửi tìm kiếm", "Submit search")}
              >
                <Search size={22} aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
