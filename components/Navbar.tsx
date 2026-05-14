"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenItems, setMobileOpenItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
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
  }, [pathname]);

  const toggleMobileItem = (href: string) => {
    setMobileOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  };

  const LangToggle = ({ small }: { small?: boolean }) => (
    <div
      className={`flex items-center border border-white/20 rounded overflow-hidden font-bold text-xs ${
        small ? "h-8" : "h-10"
      }`}
    >
      <button
        onClick={() => setLang("vi")}
        className={`h-full px-3 transition-all duration-200 ${
          lang === "vi" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLang("en")}
        className={`h-full px-3 transition-all duration-200 ${
          lang === "en" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
        }`}
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
              src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/69ba7546394f41773827398.jpg"
              alt="Logo Hữu Thành"
              className="w-10 h-10 object-contain rounded"
            />
            <div>
              <div className="text-white font-bold text-lg leading-tight">Hữu Thành</div>
              <div className="text-orange-400 text-xs tracking-widest uppercase">Construction</div>
            </div>
          </Link>

          {/* Desktop Nav — hiển thị trực tiếp trên header */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {desktopLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                      pathname.startsWith(link.href) && link.href !== "/"
                        ? "text-orange-400"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openDropdown === link.href ? "rotate-180" : ""
                      }`}
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
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2.5 px-5 py-3 text-sm text-white/70 hover:text-orange-400 hover:bg-white/5 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-orange-500 shrink-0" />
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
            <LangToggle />
            <Link
              href="/lien-he"
              className="h-10 flex items-center bg-orange-500 hover:bg-orange-600 text-white px-5 rounded text-sm font-semibold transition-colors duration-200"
            >
              {t("Liên hệ ngay", "Contact Us")}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-2">
            <LangToggle small />
            <button
              className="text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
                      <button
                        onClick={() => toggleMobileItem(link.href)}
                        className="w-full flex items-center justify-between py-3 px-4 rounded text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            mobileOpenItems.has(link.href) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
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
                                className="flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-sm text-white/60 hover:text-orange-400 hover:bg-white/5 rounded transition-colors"
                              >
                                <span className="w-1 h-1 rounded-full bg-orange-500 shrink-0" />
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
    </header>
  );
}
