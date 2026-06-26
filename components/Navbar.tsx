"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenItems, setMobileOpenItems] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    {
      href: "/gioi-thieu",
      label: t("Giới thiệu", "About"),
      children: [
        { label: t("Tổng quan", "Overview"), href: "/gioi-thieu" },
        { label: t("Tầm nhìn & Sứ mệnh", "Vision & Mission"), href: "/gioi-thieu#tam-nhin-su-menh" },
        { label: t("Giá trị cốt lõi", "Core Values"), href: "/gioi-thieu#gia-tri-cot-loi" },
        { label: t("Hồ sơ năng lực", "Company Profile"), href: "/gioi-thieu#ho-so-nang-luc" },
      ],
    },
    {
      href: "/#linh-vuc-hoat-dong",
      label: t("Lĩnh vực hoạt động", "Operations"),
      children: [
        { label: t("Cảng biển", "Ports & Harbors"), href: "/du-an?loai=cang-bien" },
        { label: t("Hạ tầng kỹ thuật", "Technical Infrastructure"), href: "/du-an?loai=ha-tang" },
        { label: t("Thiết bị thi công", "Construction Equipment"), href: "/thiet-bi" },
      ],
    },
    { href: "/du-an", label: t("Dự án", "Projects") },
    {
      href: "/tin-tuc",
      label: t("Tin tức", "News"),
      children: [
        { label: t("Tất cả tin tức", "All News"), href: "/tin-tuc" },
        { label: t("Tuyển dụng", "Careers"), href: "/tuyen-dung" },
      ],
    },
    {
      href: "/gioi-thieu#ho-so-nang-luc",
      label: t("Cổ đông", "Shareholders"),
      children: [
        { label: t("Hồ sơ năng lực", "Company Profile"), href: "/gioi-thieu#ho-so-nang-luc" },
        { label: t("Liên hệ doanh nghiệp", "Corporate Contact"), href: "/lien-he" },
      ],
    },
    {
      href: "/tuyen-dung",
      label: t("Tuyển dụng", "Careers"),
      children: [
        { label: t("Cơ hội nghề nghiệp", "Opportunities"), href: "/tuyen-dung" },
        { label: t("Liên hệ tuyển dụng", "Recruitment Contact"), href: "/lien-he" },
      ],
    },
    { href: "/lien-he", label: t("Liên hệ", "Contact") },
  ];

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
    <div className={`flex items-center gap-2 font-semibold text-slate-800 ${small ? "text-sm" : "text-base"}`}>
      <button
        type="button"
        onClick={() => setLang(lang === "vi" ? "en" : "vi")}
        className={`flex items-center gap-2 transition-colors hover:text-orange-500 ${small ? "h-9 px-2" : "h-11 px-1"}`}
        aria-label={t("Đổi ngôn ngữ", "Change language")}
      >
        <span className="flex h-4 w-6 items-center justify-center rounded-[1px] bg-red-600 text-[9px] leading-none text-yellow-300">
          ★
        </span>
        <span>{lang.toUpperCase()}</span>
        <ChevronDown size={small ? 14 : 16} strokeWidth={2.4} />
      </button>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white shadow-[0_1px_10px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex h-20 max-w-[1640px] items-center px-4 sm:px-6 lg:h-[86px] lg:px-8">
        <Link
          href="/"
          className="flex h-full w-[108px] shrink-0 items-center justify-center rounded-b-2xl bg-white sm:w-[120px] xl:w-[132px]"
          aria-label="Hữu Thành Corp."
        >
          <img
            src="/images/huu-thanh-corp-logo-3d.png"
            alt="Hữu Thành Corp."
            className="block h-[70px] w-auto object-contain sm:h-[76px] lg:h-[82px]"
          />
        </Link>

        <nav className="ml-auto hidden h-full items-center gap-1 xl:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.href}
                className="relative flex h-full items-center"
                onMouseEnter={() => setOpenDropdown(link.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex h-full items-center gap-2 px-3 text-[15px] font-semibold uppercase tracking-normal transition-colors xl:px-4 xl:text-base ${
                    pathname.startsWith(link.href.split("#")[0]) && link.href !== "/"
                      ? "text-orange-500"
                      : "text-slate-700 hover:text-orange-500"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    strokeWidth={2.4}
                    className={`transition-transform duration-200 ${openDropdown === link.href ? "rotate-180" : ""}`}
                  />
                </Link>

                <AnimatePresence>
                  {openDropdown === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-0 top-full w-64 overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block border-b border-slate-100 px-5 py-3 text-sm font-semibold uppercase text-slate-600 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-orange-500"
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
                className={`flex h-full items-center px-3 text-[15px] font-semibold uppercase tracking-normal transition-colors xl:px-4 xl:text-base ${
                  pathname === link.href
                    ? "text-orange-500"
                    : "text-slate-700 hover:text-orange-500"
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="ml-2 flex h-11 w-11 items-center justify-center text-slate-800 transition-colors hover:text-orange-500"
            aria-label={t("Tìm kiếm", "Search")}
          >
            <Search size={24} strokeWidth={3} />
          </button>
          <LangToggle />
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <button
            type="button"
            className="p-2 text-slate-800 transition-colors hover:text-orange-500"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={t("Tìm kiếm", "Search")}
          >
            <Search size={22} strokeWidth={2.6} />
          </button>
          <LangToggle small />
          <button
            type="button"
            className="p-2 text-slate-800 transition-colors hover:text-orange-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-200 bg-white xl:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.035 }}
                >
                  {link.children ? (
                    <>
                      <div className="flex items-center text-slate-700 transition-colors hover:bg-slate-50 hover:text-orange-500">
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-3 pl-4 pr-2 text-sm font-semibold uppercase"
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
                            size={15}
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
                                className="block py-2.5 pl-8 pr-4 text-sm font-medium uppercase text-slate-500 transition-colors hover:bg-slate-50 hover:text-orange-500"
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
                      className={`block px-4 py-3 text-sm font-semibold uppercase transition-colors ${
                        pathname === link.href
                          ? "bg-slate-50 text-orange-500"
                          : "text-slate-700 hover:bg-slate-50 hover:text-orange-500"
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
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Tìm kiếm dự án, thiết bị, tin tức ...", "Search projects, equipment, news ...")}
                className="h-14 min-w-0 flex-1 bg-transparent px-5 text-base text-slate-900 outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="flex h-14 w-14 shrink-0 items-center justify-center text-slate-700 transition-colors hover:text-orange-500"
                aria-label={t("Tìm kiếm", "Search")}
              >
                <Search size={22} strokeWidth={2.6} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
